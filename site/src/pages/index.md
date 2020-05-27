# Getting Started

**DFlex** is a JavaScript ambitious project to manipulate DOM Elements. It
offers a solution to manipulate DOM elements with API easy to use
and implement. It doesn't reinvent the wheel instead it was built upon
what we already have.

Growth and flexibility are what define this project that's why it contains different
packages helping to shape the final product and make it handy to use
depending on your project requirements.

## DOM relations algorithm

Generates relations between DOM elements based on element depth. For each DOM
node, it generates three keys: Siblings, Parent and Children keys and two
indexes one refers to node order in its level and the other refers to the parent
index in parental level. Together: keys and indexes combined form of
uniqueness for each element.

## DOM traversal store

DFlex store works on connecting all registered elements and organizes the
relations between them using the DOM relations generator algorithm. Allowing
each element to be reached recursively using its id.
