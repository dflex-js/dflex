declare const __DEV__: boolean;

declare global {
  // eslint-disable-next-line
  var $DFlex: DFlexDnDStore;
}


declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}