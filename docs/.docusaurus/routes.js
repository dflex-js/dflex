
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','d7d'),
  exact: true,
},
{
  path: '/__docusaurus/debug',
  component: ComponentCreator('/__docusaurus/debug','3d6'),
  exact: true,
},
{
  path: '/__docusaurus/debug/config',
  component: ComponentCreator('/__docusaurus/debug/config','914'),
  exact: true,
},
{
  path: '/__docusaurus/debug/content',
  component: ComponentCreator('/__docusaurus/debug/content','d12'),
  exact: true,
},
{
  path: '/__docusaurus/debug/globalData',
  component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
  exact: true,
},
{
  path: '/__docusaurus/debug/metadata',
  component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
  exact: true,
},
{
  path: '/__docusaurus/debug/registry',
  component: ComponentCreator('/__docusaurus/debug/registry','0da'),
  exact: true,
},
{
  path: '/__docusaurus/debug/routes',
  component: ComponentCreator('/__docusaurus/debug/routes','244'),
  exact: true,
},
{
  path: '/blog',
  component: ComponentCreator('/blog','d42'),
  exact: true,
},
{
  path: '/blog/hello-world',
  component: ComponentCreator('/blog/hello-world','1c0'),
  exact: true,
},
{
  path: '/blog/hola',
  component: ComponentCreator('/blog/hola','8b1'),
  exact: true,
},
{
  path: '/blog/tags',
  component: ComponentCreator('/blog/tags','ac3'),
  exact: true,
},
{
  path: '/blog/tags/docusaurus',
  component: ComponentCreator('/blog/tags/docusaurus','c18'),
  exact: true,
},
{
  path: '/blog/tags/facebook',
  component: ComponentCreator('/blog/tags/facebook','a3a'),
  exact: true,
},
{
  path: '/blog/tags/hello',
  component: ComponentCreator('/blog/tags/hello','432'),
  exact: true,
},
{
  path: '/blog/tags/hola',
  component: ComponentCreator('/blog/tags/hola','2a8'),
  exact: true,
},
{
  path: '/blog/welcome',
  component: ComponentCreator('/blog/welcome','952'),
  exact: true,
},
{
  path: '/docs',
  component: ComponentCreator('/docs','459'),
  
  routes: [
{
  path: '/docs/',
  component: ComponentCreator('/docs/','01d'),
  exact: true,
},
{
  path: '/docs/dom-gen/introduction',
  component: ComponentCreator('/docs/dom-gen/introduction','746'),
  exact: true,
},
{
  path: '/docs/dom-store/introduction',
  component: ComponentCreator('/docs/dom-store/introduction','8a3'),
  exact: true,
},
{
  path: '/docs/drag-drop/examples',
  component: ComponentCreator('/docs/drag-drop/examples','22e'),
  exact: true,
},
{
  path: '/docs/drag-drop/introduction',
  component: ComponentCreator('/docs/drag-drop/introduction','519'),
  exact: true,
},
{
  path: '/docs/draggable/examples',
  component: ComponentCreator('/docs/draggable/examples','7c6'),
  exact: true,
},
{
  path: '/docs/draggable/introduction',
  component: ComponentCreator('/docs/draggable/introduction','e84'),
  exact: true,
},
{
  path: '/docs/guiding-principles',
  component: ComponentCreator('/docs/guiding-principles','60e'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
