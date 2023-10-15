const INDEX = "data-index";
const DRAGGED = "dragged";

export const DFLEX_ATTRIBUTES = Object.freeze({
  DRAGGED,
  INDEX,
});

export type AllowedAttributes = keyof typeof DFLEX_ATTRIBUTES;
