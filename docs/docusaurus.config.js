const liveExampleItems = [
  {
    label: "Draggable",
    to: "docs/draggable/examples",
  },
  {
    label: "Drag & Drop",
    to: "docs/drag-drop/examples",
  },
];

const socialItems = [
  {
    label: "Github",
    to: "https://github.com/jalal246/dflex/",
  },
];

const docItems = [
  {
    label: "DFlex Guide",
    to: "docs/",
  },
  {
    label: "DOM Generator",
    to: "docs/dom-gen/introduction",
  },
  {
    label: "DOM Store",
    to: "docs/dom-store/introduction",
  },
  {
    label: "Draggable",
    to: "docs/draggable/introduction",
  },
  {
    label: "Drag and Drop",
    to: "docs/drag-drop/introduction",
  },
];

module.exports = {
  title: "DFlex",
  tagline: "JavaScript Project to Manipulate DOM Elements",
  url: "https://jalal246.github.io/",
  baseUrl: "/dflex/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "jalal246", // Usually your GitHub org/user name.
  projectName: "dflex", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "DFlex",
      logo: {
        alt: "DFlex Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          label: "Examples",
          position: "left",
          items: liveExampleItems,
        },
        {
          href: "https://github.com/jalal246/dflex",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: docItems,
        },
        {
          title: "Live Examples",
          items: liveExampleItems,
        },
        {
          title: "Social",
          items: socialItems,
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jalal MK  and contributors`,
      logo: {
        src: "img/logo-footer.png",
      },
    },
    gtag: {
      trackingID: "G-6BBMT8R70B",
      anonymizeIP: true,
    },
  },
  themes: ["@docusaurus/theme-live-codeblock"],
  plugins: [
    // [
    //   "@docusaurus/plugin-pwa",
    //   {
    //     debug: true,
    //     offlineModeActivationStrategies: ["appInstalled", "queryString"],
    //     pwaHead: [
    //       {
    //         tagName: "link",
    //         rel: "icon",
    //         href: "/img/logo-footer.png",
    //       },
    //       {
    //         tagName: "link",
    //         rel: "manifest",
    //         href: "/manifest.json", // your PWA manifest
    //       },
    //       {
    //         tagName: "meta",
    //         name: "theme-color",
    //         content: " #40241a",
    //       },
    //     ],
    //   },
    // ],
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/jalal246/dflex/edit/master/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "weekly",
          priority: 0.5,
          trailingSlash: false,
        },
      },
    ],
  ],
};
