# @dflex

> JavaScript Ambitious Project to Deal with DOM Elements.

## Packages Overview

### [@dflex/dom-gen](https://github.com/jalal246/dflex/tree/master/packages/dom-gen) DOM relations generator algorithm

Generates relations between DOM elements based on element depth. For each DOM
node, it generates three keys: Siblings, Parent and Children keys and two
indexes one refers to node order in its level and the other refers to the parent
index in parental level. Together: keys and indexes combined form of
uniqueness for each element.

### [@dflex/store](https://github.com/jalal246/dflex/tree/master/packages/store) The place where you traverse through the DOM tree using element-id

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.
