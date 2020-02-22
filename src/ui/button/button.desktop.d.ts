import { ButtonBase } from "@nativescript/core/ui/button/button-common";
import { QPushButton } from "@nodegui/nodegui";
export * from "@nativescript/core/ui/button/button-common";
export declare class Button extends ButtonBase {
    nativeViewProtected: QPushButton;
    private _stateListAnimator;
    private _highlightedHandler;
    private _releasedHandler;
    createNativeView(): QPushButton;
    initNativeView(): void;
    disposeNativeView(): void;
    resetNativeView(): void;
    _updateButtonStateChangeHandler(subscribe: boolean): void;
    protected getDefaultElevation(): number;
    protected getDefaultDynamicElevationOffset(): number;
}
