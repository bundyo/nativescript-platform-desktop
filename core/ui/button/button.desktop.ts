import {
    ButtonBase,
    PseudoClassHandler,
    TextAlignment,
    textAlignmentProperty,
    zIndexProperty
} from "@nativescript/core/ui/button/button-common";
import {profile} from "@nativescript/core/profiling";
import {device} from "@nativescript/core/platform";
import lazy from "@nativescript/core/utils/lazy";
import {QPushButton, WidgetEventTypes} from "@nodegui/nodegui";
import {uniqId} from "../../utils/utils.desktop";
import {View} from "../core/view/view.desktop";

export * from "@nativescript/core/ui/button/button-common";

const sdkVersion = lazy(() => parseInt(device.sdkVersion));

let ClickListener: any;
let APILEVEL: number;
//let AndroidButton: typeof android.widget.Button;

function initializeClickListener(): void {
    if (ClickListener) {
        return;
    }

    class ClickListenerImpl {
        private owner: any;

        constructor(owner) {
            this.owner = owner;
        }

        public onClick(v): void {
            if (this.owner) {
                this.owner._emit(ButtonBase.tapEvent);
            }
        }
    }

    ClickListener = ClickListenerImpl;
}

export class Button extends ButtonBase {
    nativeViewProtected: QPushButton;

    private _stateListAnimator: any;
    private _highlightedHandler: () => void;
    private _releasedHandler: () => void;

    @profile
    public createNativeView() {
        const button = new QPushButton();
        button.setObjectName(uniqId());

        return button;
    }

    public initNativeView(): void {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        initializeClickListener();
        const clickListener = new ClickListener(this);
        nativeView.addEventListener(WidgetEventTypes.MouseButtonPress, clickListener.onClick.bind(clickListener));
        (<any>nativeView).clickListener = clickListener;
        this._updateButtonStateChangeHandler(true);

        (<View><unknown>this).styles
            .apply();
    }

    public disposeNativeView() {
        if (this.nativeViewProtected) {
            (<any>this.nativeViewProtected).clickListener.owner = null;
        }
        super.disposeNativeView();
    }

    public resetNativeView(): void {
        super.resetNativeView();

        // if (this._stateListAnimator && APILEVEL >= 21) {
        //     (<any>this.nativeViewProtected).setStateListAnimator(this._stateListAnimator);
        //     this._stateListAnimator = undefined;
        // }
    }

    @PseudoClassHandler("normal", "highlighted", "pressed", "active")
    _updateButtonStateChangeHandler(subscribe: boolean) {
        if (this.nativeViewProtected) {
            if (subscribe) {
                this._highlightedHandler = this._highlightedHandler || (() => {
                    console.log();
                    super._goToVisualState("highlighted");
                });
                this._releasedHandler = this._releasedHandler || (() => {
                    console.log();
                    super._goToVisualState("normal");
                });
                this.nativeViewProtected.addEventListener("pressed", this._highlightedHandler);
                this.nativeViewProtected.addEventListener("released", this._releasedHandler);
            } else {
                this.nativeViewProtected.removeEventListener("pressed", this._highlightedHandler);
                this.nativeViewProtected.removeEventListener("released", this._releasedHandler);
            }
        }
    }

    // [paddingTopProperty.getDefault](): Length {
    //     return { value: this._defaultPaddingTop, unit: "px" };
    // }
    // [paddingTopProperty.setNative](value: Length) {
    //     this.nativeViewProtected.setInlineStyle(`padding-top: ${value}`);
    // }
    //
    // [paddingRightProperty.getDefault](): Length {
    //     return { value: this._defaultPaddingRight, unit: "px" };
    // }
    // [paddingRightProperty.setNative](value: Length) {
    //     this.nativeViewProtected.setInlineStyle(`padding-right: ${value}`);
    // }
    //
    // [paddingBottomProperty.getDefault](): Length {
    //     return { value: this._defaultPaddingBottom, unit: "px" };
    // }
    // [paddingBottomProperty.setNative](value: Length) {
    //     this.nativeViewProtected.setInlineStyle(`padding-bottom: ${value}`);
    // }
    //
    // [paddingLeftProperty.getDefault](): Length {
    //     return { value: this._defaultPaddingLeft, unit: "px" };
    // }
    // [paddingLeftProperty.setNative](value: Length) {
    //     this.nativeViewProtected.setInlineStyle(`padding-left: ${value}`);
    // }

    [zIndexProperty.setNative](value: number) {
        // API >= 21
        // if (APILEVEL >= 21) {
        //     const nativeView = this.nativeViewProtected;
        //     if (!this._stateListAnimator) {
        //         this._stateListAnimator = (<any>nativeView).getStateListAnimator();
        //     }
        //     (<any>nativeView).setStateListAnimator(null);
        // }
        //
        // org.nativescript.widgets.ViewHelper.setZIndex(this.nativeViewProtected, value);
    }

    [textAlignmentProperty.setNative](value: TextAlignment) {
        // Button initial value is center.
        const newValue = value === "initial" ? "center" : value;
        super[textAlignmentProperty.setNative](newValue);
    }

    protected getDefaultElevation(): number {
        if (sdkVersion() < 21) {
            return 0;
        }

        // NOTE: Button widget has StateListAnimator that defines the elevation value and
        // at the time of the getDefault() query the animator is not applied yet so we
        // return the hardcoded @dimen/button_elevation_material value 2dp here instead
        return 2;
    }

    protected getDefaultDynamicElevationOffset(): number {
        if (sdkVersion() < 21) {
            return 0;
        }

        return 4; // 4dp @dimen/button_pressed_z_material
    }
}
