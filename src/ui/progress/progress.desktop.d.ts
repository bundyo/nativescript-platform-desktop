import { ProgressBase } from "@nativescript/core/ui/progress/progress-common";
import { QProgressBar } from "@nodegui/nodegui";
import { StyleList } from "../core/view/view.desktop";
export * from "@nativescript/core/ui/progress/progress-common";
export declare const desktopChunkColorProperty: any;
export declare const desktopChunkMarginProperty: any;
export declare const desktopChunkWidthProperty: any;
export declare const textAlignmentProperty: any;
export declare class Progress extends ProgressBase {
    nativeViewProtected: QProgressBar;
    styles: StyleList;
    createNativeView(): QProgressBar;
    get desktop(): QProgressBar;
}
