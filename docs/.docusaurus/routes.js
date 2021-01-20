
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
