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
  const pages = await fetch(
    "https://development.nomcom-new.nomensa.xyz/wp-json/wp/v2/pages",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json())

  const results = Promise.all(pages.map(async page => {
    const arrOfLinks = await handleSlices(page.content.rendered) 
    return {
      id: page?.id,
      title: page?.title.rendered,
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

async function handleSlices(content) {
  return await handleFindContentLinks(content)
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
