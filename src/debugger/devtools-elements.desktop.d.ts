import { InspectorCommands, InspectorEvents } from "@nativescript/core/debugger/devtools-elements";
export declare function attachDOMInspectorEventCallbacks(DOMDomainFrontend: InspectorEvents): void;
export declare function attachDOMInspectorCommandCallbacks(DOMDomainBackend: InspectorCommands): void;
export declare function attachCSSInspectorCommandCallbacks(CSSDomainBackend: InspectorCommands): void;
