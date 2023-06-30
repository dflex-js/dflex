import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

export type ChangedIds = Set<{ oldId: string; newId: string }>;

function DFlexIDModifier(store: DFlexDnDStore, changedIds: ChangedIds): void {
  changedIds.forEach((idSet) => {
    if (store.registry.has(idSet.oldId)) {
      const elm = store.registry.get(idSet.oldId)!;
      const elmBranch = store.getElmSiblingsByKey(elm.keys.SK);

      // Update registry.
      store.registry.set(idSet.newId, elm);
      store.registry.delete(idSet.oldId);

      // Update DOM-gen branch.
      elmBranch[elm.VDOMOrder.self] = idSet.newId;

      // Update instance.
      elm.id = idSet.newId;
    }
  });
}

export default DFlexIDModifier;
