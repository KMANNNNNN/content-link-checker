const express = require('express')
const app = express()

app.get('/', async (req, res) => {
  const postsData = await DataCollection()

  res.status(200).send(postsData)
})

app.listen(3001, () => {
  console.log('My super badass app booom!')
})

async function DataCollection() {
  const posts = await fetch(
    "https://content.nomensa.com/blog?_start=0&_limit=2",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json())

  const results = Promise.all(posts.map(async post => {
    const arrOfLinks = await handleSlices(post?.slices) 
    return {
      id: post?.id,
      title: post?.title,
      page_slug: post?.slug,
      links: arrOfLinks.reduce((acc, links) => {
        if (!links) return acc
        return [
          ...acc,
          ...links,
        ]
      }, [])
    }
  }))

  return results
}

async function handleSlices(slices) {
  return Promise.all(slices.map(async (slice) => {
    if (slice.__component === "slices.textblock") {
      return await handleFindContentLinks(slice.content)
    }
  }))
}

async function handleFindContentLinks(content) {
  const linkRegex = /href=['"](?<url>.*?)['"]|\[(.+)\]\(([^ ]+)( "(.+)")?\)/gm;
  const links = content.match(linkRegex);
  let linksArray = [];

  for (const link of links) {
    const formattedLink = link
    .replace('href="', "")
    .replace(/^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/gm, "$2")
    .replace('"', "")
    .replace(",", "");

    if (
      formattedLink.length > 10 &&
      formattedLink.includes("nomensa.com") &&
      !formattedLink.includes(".jpg") &&
      !formattedLink.includes(".png")
      ) {

      const linkStatusCheckerData = await linkStatusChecker(formattedLink)

      linksArray.push({
        html_link: `
          <li class="link">
            <a href="${formattedLink}" target="_blank">${
          formattedLink.includes("javascript:")
            ? "<span class='text-red-500'>Event: " + formattedLink + "</span>"
            : formattedLink
            }</a><span>${linkStatusCheckerData.status}</span>
          </li>
        `,
        status: linkStatusCheckerData.status,
        url: formattedLink
      });
    }
  }
  return linksArray
};

async function linkStatusChecker(url) {
  if (!url || !url.length > 10) return
  
  try {
    const response = await fetch(url)
    const data = await response

    return data
  } catch (error) {
    console.log(error);
  }
}
