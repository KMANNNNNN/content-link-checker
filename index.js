import "./styles.css";

let postsArray = [];

const contentRow = document.getElementById("nomensa-data-section");

const handleFindContentLinks = (content) => {
  const linkRegex = /href=['"](?<url>.*?)['"]|\[(.+)\]\(([^ ]+)( "(.+)")?\)/gm;
  const links = content.match(linkRegex);
  let linksArray = [];

  console.log(linksArray);

  links &&
    links.forEach((link) => {
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
        linksArray.push(`
          <li class="link">
            <a href="${formattedLink}" target="_blank">${
          formattedLink.includes("javascript:")
            ? "<span class='text-red-500'>Event: " + formattedLink + "</span>"
            : formattedLink
        }</a>
          </li>
        `);
      }

      return undefined;
    });

  return linksArray;
};

const button = document.querySelector(".submit_button");

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

  try {
    setTimeout(() => {
      button.classList.remove("cursor-not-allowed");
      button.firstElementChild.classList.add("hidden");
      button.removeAttribute("disabled");

      posts.forEach((post) => {
        post.slices.map((slice) => {
          if (slice.__component === "slices.textblock") {
            return postsArray.push({
              title: post.title,
              url: `https://nomensa.com/blog/${post.slug}`,
              content: handleFindContentLinks(slice.content).join("")
            });
          }

          return null;
        });

        const contentRow = document.getElementById("nomensa-data-section");
        const child = contentRow.appendChild(document.createElement("tr"));

        postsArray.forEach((post) => {
          child.innerHTML = `
            <td class="border border-white p-4 text-white">
              <strong>${post.title}</strong>
            </td>
            <td class="border border-white p-4 text-slate-500 dark:text-white underline"><a href="${post.url}" target="_blank">${post.url}</a></td>
            <td class="border border-white p-4 text-slate-500 dark:text-white underline">
              <ul class="pl-3 list-decimal">
                ${post.content}
              </ul>
            </td>`;
        });
      });
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};

document.querySelector(".submit_button").addEventListener("click", () => {
  button.classList.add("cursor-not-allowed");
  button.firstElementChild.classList.remove("hidden");
  button.setAttribute("disabled", "true");

  contentRow.innerHTML = "";

  DataCollection();
});
