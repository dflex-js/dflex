# @dflex

> JavaScript Project to manipulate DOM Elements.

## Packages Overview

### [@dflex/dom-gen](https://github.com/jalal246/dflex/tree/master/packages/dom-gen)

> DOM relations generator algorithm

<p align="center">
 <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/dom-gen/img/connect.png" alt="how algorithm connect nodes"/>
</p>

Generates relations between DOM elements based on element depth. For each DOM
node, it generates three keys: Siblings, Parent and Children keys and two
indexes one refers to node order in its level and the other refers to the parent
index in parental level. Together: keys and indexes combined form of
uniqueness for each element.

### [@dflex/store](https://github.com/jalal246/dflex/tree/master/packages/store)

> Traverse through the DOM tree using element-id.

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.

<p align="center">
 <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/store/img/store-registry.png" alt="how register works"/>
</p>

### [@dflex/draggable](https://github.com/jalal246/dflex/tree/master/packages/draggable)

> Draggable is a native component written in pure JS works for Web and Mobile

DFlex draggable is the simplest solution to create JavaScript draggable
elements. No need for special tutorial and thinking about implementation
complexity or even migration to different technologies for different frameworks.
It can be used with any JavaScript frameworks React, Vue, Angular.

<p align="center">
 <img src="https://raw.githubusercontent.com/jalal246/dflex/master/packages/draggable/img/draggable.gif" alt="how register works"/>
</p>
