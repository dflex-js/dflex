import { PointNum } from "../Point";

function updateElmDatasetGrid(DOM: HTMLElement, grid: PointNum) {
  DOM.dataset.devX = `${grid.x}`;
  DOM.dataset.devY = `${grid.y}`;
}

export default updateElmDatasetGrid;
