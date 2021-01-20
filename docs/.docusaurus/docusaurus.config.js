export default {
  "title": "DFlex",
  "tagline": "JavaScript Project to Manipulate DOM Elements",
  "url": "https://jalal246.github.io/",
  "baseUrl": "/dflex/",
  "onBrokenLinks": "throw",
  "onBrokenMarkdownLinks": "warn",
  "favicon": "img/favicon.ico",
  "organizationName": "jalal246",
  "projectName": "dflex",
  "themeConfig": {
    "navbar": {
      "title": "DFlex",
      "logo": {
        "alt": "DFlex Logo",
        "src": "img/logo.svg"
      },
      "items": [
        {
          "to": "docs/",
          "activeBasePath": "docs",
          "label": "Docs",
          "position": "left"
        },
        {
          "href": "https://github.com/jalal246/dflex",
          "label": "GitHub",
          "position": "right"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "style": "light",
      "links": [
        {
          "title": "Docs",
          "items": [
            {
              "label": "DFlex Guide",
              "to": "docs/"
            },
            {
              "label": "DOM Generator",
              "to": "docs/dom-gen/introduction"
            },
            {
              "label": "DOM Store",
              "to": "docs/dom-store/introduction"
            },
            {
              "label": "Draggable",
              "to": "docs/draggable/introduction"
            },
            {
              "label": "Drag and Drop",
              "to": "docs/drag-drop/introduction"
            }
          ]
        },
        {
          "title": "Social",
          "items": [
            {
              "label": "Github",
              "to": "https://github.com/jalal246/dflex/"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2021 Jalal MK  and contributors",
      "logo": {
        "src": "img/logo-footer.png"
      }
    },
    "gtag": {
      "trackingID": "G-6BBMT8R70B",
      "anonymizeIP": true
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "prism": {
      "additionalLanguages": []
    },
    "hideableSidebar": false
  },
  "plugins": [],
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "D:\\projects\\dflex\\docs\\sidebars.js",
          "editUrl": "https://github.com/jalal246/dflex/edit/master/docs/"
        },
        "theme": {
          "customCss": "D:\\projects\\dflex\\docs\\src\\css\\custom.css"
        },
        "sitemap": {
          "cacheTime": 600000,
          "changefreq": "weekly",
          "priority": 0.5,
          "trailingSlash": false
        }
      }
    ]
  ],
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};