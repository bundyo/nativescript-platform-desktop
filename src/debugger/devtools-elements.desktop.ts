import { InspectorCommands, InspectorEvents } from "@nativescript/core/debugger/devtools-elements";
//import { registerInspectorEvents, DOMNode } from "@nativescript/core/debugger/dom-node";

export function attachDOMInspectorEventCallbacks(
  DOMDomainFrontend: InspectorEvents
) {
  // registerInspectorEvents(DOMDomainFrontend);
  //
  // const originalChildNodeInserted: (parentId: number, lastId: number, node: string | DOMNode) => void = DOMDomainFrontend.childNodeInserted;
  //
  // DOMDomainFrontend.childNodeInserted = (parentId: number, lastId: number, node: DOMNode) => {
  //     originalChildNodeInserted(parentId, lastId, node.toObject());
  // };
}

export function attachDOMInspectorCommandCallbacks(
  DOMDomainBackend: InspectorCommands
) {
  // DOMDomainBackend.getDocument = getDocument;
  // DOMDomainBackend.removeNode = removeNode;
  // DOMDomainBackend.setAttributeAsText = setAttributeAsText;
}

export function attachCSSInspectorCommandCallbacks(
  CSSDomainBackend: InspectorCommands
) {
  // CSSDomainBackend.getComputedStylesForNode = getComputedStylesForNode;
}
