import { PageBase, ViewBase } from "@nativescript/core/ui/page/page-common";
import { QWidget } from "@nodegui/nodegui";
import { View } from "../core/view/view.desktop";
export * from "@nativescript/core/ui/page/page-common";
export declare class Page extends PageBase {
    nativeViewProtected: QWidget;
    private _actionBarView;
    private _contentView;
    private _actionBarWidget;
    private _contentWidget;
    createNativeView(): QWidget;
    initNativeView(): void;
    _addViewToNativeVisualTree(view: View, atIndex?: number): boolean;
    _resizeHandler(): void;
    _removeViewFromNativeVisualTree(view: ViewBase): void;
    onLoaded(): void;
    private updateActionBar;
}
