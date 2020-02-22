import { ScrollViewBase, ViewBase } from "@nativescript/core/ui/scroll-view/scroll-view-common";
import { QScrollArea } from "@nodegui/nodegui";
export * from "@nativescript/core/ui/scroll-view/scroll-view-common";
export declare class ScrollView extends ScrollViewBase {
    nativeViewProtected: QScrollArea;
    private _scrollBarSize;
    get horizontalOffset(): number;
    get verticalOffset(): number;
    get scrollableWidth(): number;
    get scrollableHeight(): number;
    scrollToVerticalOffset(value: number, animated: boolean): void;
    scrollToHorizontalOffset(value: number, animated: boolean): void;
    createNativeView(): QScrollArea;
    _addViewToNativeVisualTree(view: ViewBase, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(view: ViewBase): void;
    initNativeView(): void;
    _resizeHandler(): void;
    _onOrientationChanged(): void;
    protected attachNative(): void;
    private _lastScrollX;
    private _lastScrollY;
    private _onScrollChanged;
    protected dettachNative(): void;
}
