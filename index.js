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
    "https://development.nomcom-new.nomensa.xyz/wp-json/wp/v2/posts?per_page=100&offset=100",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json())

  const results = Promise.all(posts.map(async post => {
    const arrOfLinks = await handleSlices(post?.content.rendered)

    return {
      id: post?.id,
      title: post?.title.rendered,
      page_slug: post?.slug,
      links: arrOfLinks.reduce((acc, links) => {
        if (!links) return acc

        return [
          ...acc,
          links,
        ]
      }, [])
    }
  }))

  return results
}

async function handleSlices(content) {
  return await handleFindContentLinks(content.replace(/\\/g, ))
}

async function handleFindContentLinks(content) {
  const linkRegex = /href=\||['"](?<url>.*?)['"]|\[(.+)\]\(([^ ]+)( "(.+)")?\)/gm;
  let links = content.match(linkRegex);

  let linksArray = [];

  if (!links) return []

  for (const link of links) {
    const formattedLink = link
    .replace('href="', "")
    .replace(/^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/gm, "$2")
    .replace(/\[([^\[]+)\](\(.*\))/gm, "$2")
    .replace('"', "")
    .replace('(', '')
    .replace(')', '')
    .replace(",", "");

    if (
      formattedLink.length > 10 &&
      formattedLink.length < 100 &&
      formattedLink.includes("nomensa.com") &&
      !formattedLink.includes(".jpg") &&
      !formattedLink.includes(".png") && 
      !formattedLink.includes(".gif") && 
      !formattedLink.includes("mailto")
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
        url: formattedLink.replace('"', '')
      });
    }
  }
  return linksArray
};

async function linkStatusChecker(url) {
  if (!url || !url.length > 10 || url.length > 100) return
  
  const newUrl = url.replace('"', '');

  try {
    const response = await fetch(newUrl)
    const data = await response

    return data
  } catch (error) {
    console.log(error);
  }
}
