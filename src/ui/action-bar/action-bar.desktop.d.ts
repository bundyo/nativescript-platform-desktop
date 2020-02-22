import { ActionBarBase, ActionItemBase } from "@nativescript/core/ui/action-bar/action-bar-common";
import { QWidget } from "@nodegui/nodegui";
import { StyleList, View } from "../core/view/view.desktop";
export * from "@nativescript/core/ui/action-bar/action-bar-common";
export declare class ActionItem extends ActionItemBase {
    private _desktop;
    private _label;
    styles: StyleList;
    nativeViewProtected: QWidget;
    createNativeView(): QWidget;
    initNativeView(): void;
    _addViewToNativeVisualTree(child: View): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    disposeNativeView(): void;
    set text(value: any);
    get desktop(): Object;
    set desktop(value: Object);
}
export declare class NavigationButton extends ActionItem {
    _navigationItem: any;
    _onVisibilityChanged(visibility: string): void;
}
export declare class ActionBar extends ActionBarBase {
    nativeViewProtected: QWidget;
    styles: StyleList;
    private _titleWidget;
    private _leftWidget;
    private _rightWidget;
    get desktop(): QWidget;
    createNativeView(): QWidget;
    initNativeView(): void;
    _addChildFromBuilder(name: string, value: any): void;
    get _getActualSize(): any;
    layoutInternal(): void;
    _updateTitleAndTitleView(): void;
    update(): void;
    _updateNavigationButton(): void;
    _updateIcon(): void;
    _addActionItems(): void;
    _onTitlePropertyChanged(): void;
    _onIconPropertyChanged(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    private updateColors;
    private setColor;
    private updateFlatness;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    private get navBar();
}
