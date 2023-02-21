# Streaming inside the same container

The parent container is the same while children keep updating.

- `StreamInterval` Automatically updating the children with interval. Each time totally new children.

- `StreamNewELm` Updating the children is triggered by keyboard event. Each time totally new children.

- `StreamIncremental` Updating the children is triggered by keyboard event. Persist the old children and increment to the same container.
