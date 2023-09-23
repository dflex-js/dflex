/* eslint-disable import/prefer-default-export */
interface DOMGenKeysType {
  idsBySk: {
    [key: string]: string[];
  };
  branchesRegistry: {
    [key: string]: {
      [depth: string]: {
        ids: string[];
        SK: string;
      };
    };
  };
  SKByDepth: {
    [key: string]: string[];
  };
}

export type { DOMGenKeysType };
