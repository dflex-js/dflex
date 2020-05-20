# @dflex

> JavaScript Ambitious Project to Deal with DOM Elements.

## Packages Overview

### [@dflex/dom-gen](https://github.com/jalal246/dflex/tree/master/packages/dom-gen) DOM relations generator algorithm

It generates relations between DOM elements without storing them or creating
actual dom tree. Instead, it gets relationship based on element depth.

For each DOM node, it generates three keys: Siblings, Parent and Children
keys and two indexes one refers to node order in its level and the other refers to
the parent index in parental level so to speak. Together: keys and indexes
combined form of uniqueness for each element.

### [@dflex/store](https://github.com/jalal246/dflex/tree/master/packages/store) DOM Store

It generates relations between DOM elements without storing them or creating
actual dom tree. Instead, it gets relationship based on element depth.

For each DOM node, it generates three keys: Siblings, Parent and Children
keys and two indexes one refers to node order in its level and the other refers to
the parent index in parental level so to speak. Together: keys and indexes
combined form of uniqueness for each element.
