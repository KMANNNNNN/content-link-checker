const DataCollection = async () => {
  const posts = await fetch(
    "https://content.nomensa.com/blog?_start=0&_limit=400",
    {
      method: "GET",
      withCredentials: true,
      crossorigin: true,
      mode: "cors"
    }
  ).then((res) => res.json());

  console.log(
    posts.map(post => {
      return {
        id: post?.id,
        title: post?.title,
        slug: post?.slug,
        slices: post?.slices,
      }
    })
  )
}

DataCollection()

// http://localhost:3000/data-collection
