import { Point } from "@nativescript/core/ui/core/view";
import { EventData, ShowModalOptions, ViewCommon } from "@nativescript/core/ui/core/view/view-common";
import { GestureEventData, GestureTypes } from "@nativescript/core/ui/gestures";
export * from "@nativescript/core/ui/core/view/view-common";
export { ViewCommon };
export declare class StyleList {
    view: any;
    element?: string;
    list: Map<string, string>;
    parts: Object;
    constructor(view: any, element?: string, parts?: Array<string>);
    set(name: any, style: any, part?: any): this;
    delete(name: any, part?: any): this;
    get(name?: string | any): string;
    getPart(part: string): string;
    getStyleSheet(element: string): string;
    apply(): void;
    applyStyleSheet(element?: string): void;
}
export declare class View extends ViewCommon {
    private _isClickable;
    private touchListenerIsSet;
    private layoutChangeListenerIsSet;
    nativeViewProtected: any;
    styles: StyleList;
    get desktop(): any;
    _observe(type: GestureTypes, callback: (args: GestureEventData) => void, thisArg?: any): void;
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): void;
    off(eventNames: string, callback?: any, thisArg?: any): void;
    onLoaded(): void;
    onUnloaded(): void;
    onBackPressed(): boolean;
    handleGestureTouch(event: any): any;
    private hasGestureObservers;
    initNativeView(): void;
    disposeNativeView(): void;
    private setOnTouchListener;
    private setOnLayoutChangeListener;
    get isLayoutRequired(): boolean;
    get isLayoutValid(): boolean;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    layout(left: number, top: number, right: number, bottom: number): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    _getCurrentLayoutBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
    focus(): boolean;
    getLocationInWindow(): Point;
    getLocationOnScreen(): Point;
    getLocationRelativeTo(otherView: ViewCommon): Point;
    static resolveSizeAndState(size: number, specSize: number, specMode: number, childMeasuredState: number): number;
    protected _showNativeModalView(parent: View, options: ShowModalOptions): void;
    protected _hideNativeModalView(parent: View, whenClosedCallback: () => void): void;
    _redrawNativeBackground(value: any): void;
    _addViewToNativeVisualTree(child: ViewCommon, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: ViewCommon): void;
}
export declare class CustomLayoutView extends View {
    nativeViewProtected: any;
    createNativeView(): any;
    _addViewToNativeVisualTree(child: ViewCommon, atIndex?: number): boolean;
    _updateNativeLayoutParams(child: View): void;
    _setChildMinWidthNative(child: View): void;
    _setChildMinHeightNative(child: View): void;
    _removeViewFromNativeVisualTree(child: ViewCommon): void;
}
