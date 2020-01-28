import {
    LayoutBaseCommon, clipToBoundsProperty, isPassThroughParentEnabledProperty,
    paddingLeftProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, Length
} from "@nativescript/core/ui/layouts/layout-base-common";

export * from "@nativescript/core/ui/layouts/layout-base-common";

export class LayoutBase extends LayoutBaseCommon {

    [clipToBoundsProperty.getDefault](): boolean {
        return true;
    }
    [clipToBoundsProperty.setNative](value: boolean) {
        console.warn(`clipToBounds with value false is not supported on Android. You can use this.android.getParent().setClipChildren(false) as an alternative`);
    }

    [isPassThroughParentEnabledProperty.setNative](value: boolean) {
        (<LayoutBaseCommon>this).nativeViewProtected.setPassThroughParent(value);
    }

    [paddingTopProperty.getDefault](): Length {
        return { value: (<LayoutBaseCommon>this)._defaultPaddingTop, unit: "px" };
    }
    [paddingTopProperty.setNative](value: Length) {
        // org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderTopWidth, 0));
    }

    [paddingRightProperty.getDefault](): Length {
        return { value: (<LayoutBaseCommon>this)._defaultPaddingRight, unit: "px" };
    }
    [paddingRightProperty.setNative](value: Length) {
        // org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderRightWidth, 0));
    }

    [paddingBottomProperty.getDefault](): Length {
        return { value: (<LayoutBaseCommon>this)._defaultPaddingBottom, unit: "px" };
    }
    [paddingBottomProperty.setNative](value: Length) {
        // org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderBottomWidth, 0));
    }

    [paddingLeftProperty.getDefault](): Length {
        return { value: (<LayoutBaseCommon>this)._defaultPaddingLeft, unit: "px" };
    }
    [paddingLeftProperty.setNative](value: Length) {
        // org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderLeftWidth, 0));
    }
}
