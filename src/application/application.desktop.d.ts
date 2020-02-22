import { Observable } from "@nativescript/core/application/application-common";
import { NavigationEntry, View } from "@nativescript/core/ui/frame";
import { QApplication, QMainWindow } from "@nodegui/nodegui";
import { DesktopApplication as DesktopApplicationDefinition } from "./application.desktop";
export * from "@nativescript/core/application/application-common";
export { desktopApp as desktop };
export declare class DesktopApplication extends Observable implements DesktopApplicationDefinition {
    private _orientation;
    private _rootView;
    systemAppearance: "dark" | "light" | null;
    paused: boolean;
    nativeApp: QApplication;
    mainWindow: QMainWindow;
    packageName: string;
    init(nativeApp: any): View;
    get rootView(): View;
    get orientation(): "portrait" | "landscape" | "unknown";
    set orientation(value: "portrait" | "landscape" | "unknown");
}
declare const desktopApp: DesktopApplicationDefinition;
export declare function _start(entry?: NavigationEntry | string): void;
export declare function _shouldCreateRootFrame(): boolean;
export declare function run(entry?: NavigationEntry | string): void;
export declare function addCss(cssText: string): void;
export declare function _resetRootView(entry?: NavigationEntry | string): void;
export declare function getMainEntry(): NavigationEntry;
export declare function getRootView(): View;
export declare function getNativeApplication(): QApplication;
export declare function orientation(): "portrait" | "landscape" | "unknown";
