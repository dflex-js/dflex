
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/dflex/',
  component: ComponentCreator('/dflex/','9ab'),
  exact: true,
},
{
  path: '/dflex/docs',
  component: ComponentCreator('/dflex/docs','dda'),
  
  routes: [
{
  path: '/dflex/docs/',
  component: ComponentCreator('/dflex/docs/','24a'),
  exact: true,
},
{
  path: '/dflex/docs/dom-gen/introduction',
  component: ComponentCreator('/dflex/docs/dom-gen/introduction','6bb'),
  exact: true,
},
{
  path: '/dflex/docs/dom-store/introduction',
  component: ComponentCreator('/dflex/docs/dom-store/introduction','edc'),
  exact: true,
},
{
  path: '/dflex/docs/drag-drop/examples',
  component: ComponentCreator('/dflex/docs/drag-drop/examples','908'),
  exact: true,
},
{
  path: '/dflex/docs/drag-drop/introduction',
  component: ComponentCreator('/dflex/docs/drag-drop/introduction','166'),
  exact: true,
},
{
  path: '/dflex/docs/draggable/examples',
  component: ComponentCreator('/dflex/docs/draggable/examples','6d6'),
  exact: true,
},
{
  path: '/dflex/docs/draggable/introduction',
  component: ComponentCreator('/dflex/docs/draggable/introduction','c8c'),
  exact: true,
},
{
  path: '/dflex/docs/guiding-principles',
  component: ComponentCreator('/dflex/docs/guiding-principles','e55'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
