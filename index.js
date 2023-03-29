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
    "https://content.nomensa.com/blog?_start=0&_limit=50",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json());

  return await Promise.all(posts.map( async(post) => {
    return {
      id: post?.id,
      title: post?.title,
      page_slug: post?.slug,
      links: await handleSlices(post?.slices)
    }
  }))
}

async function handleSlices(slices) {
  return await Promise.all(slices.map(async (slice) => {
    if (slice.__component === "slices.textblock") {
      return await handleFindContentLinks(slice.content)
    }
  }))
}

function handleFindContentLinks(content) {
  const linkRegex = /href=['"](?<url>.*?)['"]|\[(.+)\]\(([^ ]+)( "(.+)")?\)/gm;
  const links = content.match(linkRegex);
  let linksArray = [];

  const handleListGen = links && links.map(async (link) => {
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

      return linksArray.push({
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
  });

  
  return links && Promise.allSettled(handleListGen).then(() => {
    return linksArray
  });
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