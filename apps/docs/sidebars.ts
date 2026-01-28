import type { SidebarsConfig } from "@docusaurus/plugin-content-docs"

const sidebars: SidebarsConfig = {
  main: [
    "intro",
    {
      type: "category",
      label: "Foundation",
      items: [
        "foundation/overview",
        {
          type: "category",
          label: "Color",
          items: [
            "foundation/color/overview",
            "foundation/color/palette",
          ],
        },

        "foundation/typography",
        "foundation/spacing",
        "foundation/iconography",
      ],
    },
  ],
}

export default sidebars
