# Link Content Checker

Get the links from your content! Can easily be adapted to fit your response structure.

```json
[
  {
    0: {
      links: [
        {
          html_link: "
                    <li class="link">
                      <a href="https://www.nomensa.com/blog/2005/what-screen-reader" target="_blank">https://www.nomensa.com/blog/2005/what-screen-reader</a><span>200</span>
                    </li>
                  ",
          status: 200,
          url: "https://www.nomensa.com/blog/2005/what-screen-reader"
        },
        {
          html_link: "
                    <li class="link">
                      <a href="https://www.nomensa.com/blog/2003/configuring-jaws-individual-voice-settings" target="_blank">https://www.nomensa.com/blog/2003/configuring-jaws-individual-voice-settings</a><span>200</span>
                    </li>
                  ",
          status: 200,
          url: "https://www.nomensa.com/blog/2003/configuring-jaws-individual-voice-settings"
        },
        {
          html_link: "
                    <li class="link">
                      <a href="https://www.nomensa.com/blog/2003/how-configure-jaws-voice-settings" target="_blank">https://www.nomensa.com/blog/2003/how-configure-jaws-voice-settings</a><span>200</span>
                    </li>
                  ",
          status: 200,
          url: "https://www.nomensa.com/blog/2003/how-configure-jaws-voice-settings"
        }
      ]
    },
    id: 681,
    title: "How to configure Jaws to optimise the UX",
    page_slug: "how-configure-jaws-optimise-ux"
  }
]
```

## Scripts

Install: `$ yarn`
Run: `$ yarn dev`

Have fun! 
