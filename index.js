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
    "https://content.nomensa.com/blog?_start=0&_limit=400",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json());

  return posts.map(post => {
    return {
      id: post?.id,
      title: post?.title,
      slug: post?.slug,
      slices: post?.slices,
    }
  })
}
