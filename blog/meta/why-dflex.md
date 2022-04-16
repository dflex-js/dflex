---
title: Why DFlex?
description: A brief introduction about DFlex. What is it and why use it.
---

### Entirely new API

DFlex implements its own new API. It doesn't clone/append/remove DOM elements or
manipulate a ghost one. Instead, it matches positions and triggers the
function(s) related to the movement. It follows the very basic implementation of
the domino effect: moving one element triggers functions executed on a given
threshold to manipulate registered elements based on the new locations.

### Why don't Clone/Ghost?

Basically, because of user experience. The best user experience is to have a
fully transitional element where the user can see the movement and its flow on
the layout. But more importantly, is to have a responsive layout that's not
restricted to a limited number of elements. With all the progress that's
happening with the frontend, it's time to introduce a new API that manages the
transition away from the data flow. Instead of thinking of caching let's define
a layout where the movement is related to the functions that change positions
without refreshing the entire layout to start each time from the beginning. If
the battle now is about how to optimize DOM reconciliation, how about starting
transforming instead of brute force element positions for a simple click. Or
maintain the element state when updating the layout painting.

### A journey of discovery

This is an entirely new concept that opens a wide range of accessible and
movable elements at a low cost. Doing lists is the first experimental test to
monitor how the dragging can affect the rest of the elements. It’s not
restricted to drag and drop. However, it’s a case where one element can affect
all the siblings according to the direction. That’s how the API deals with the
list. There are different cases in the future where it is possible to show more
of what DFlex does. The priority right now is to make sure the current API
design is robust and can deal with all scenarios related to one list. Once it’s
ready, DFlex can then move to the next phase of movable layout and actions.

### The good the bad and the ugly

Introducing new ideas are always considered risky. A lot of “what’s wrong with
the usual implementations” where skepticism reaches the point that pushes you to
stop. The answer to the first point is easy, it’s a way of new ideas that’s why
websites have shifted from using jQuery to depend more and more on modern JS
frameworks. While to guarantee sustainable work and improvement I chose a dual
license.

Trying to show what's the future is not easy. However, there are different
showcases that demonstrate what DFlex can do. So if you find a bug be patient
and remember this is a new project.
