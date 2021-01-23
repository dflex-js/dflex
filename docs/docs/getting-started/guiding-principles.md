---
id: guiding-principles
title: Guiding Principles
slug: /guiding-principles
description: Guiding principles for DFlex project
keywords:
  - principles
  - docs
  - DOM
  - dflex
---

> Build, Traverse, Manipulate

All packages included backed by DOM Store. Your app knows all registered DOM
positions and can reach each node without asking the browser to do so.

When you develop a new element, you register it with the required properties you
might need later. The element can be reached in a JSON object.

No element is being duplicated or cloned. No recursive search for parents.
Every element is identified by an `id` as a unique key stored in the DOM store.

All packages work as layers that connect your application API with DOM. Bridge
to the browser to avoid repaint and re-render for heavy usage.

Most features can be added during development. If you want to drag horizontally,
you don't need to special function to do it. Give you more flexibility and less
buggy API.

Test and documentation are fundamental in this project. Test and documentation
are fundamental in this project. A native-like API should be sustainable.
