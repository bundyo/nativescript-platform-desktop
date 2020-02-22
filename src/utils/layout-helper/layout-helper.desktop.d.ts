export * from "@nativescript/core/utils/layout-helper/layout-helper-common";
export declare function makeMeasureSpec(size: number, mode: number): number;
export declare function getDisplayDensity(): number;
export declare function toDevicePixels(value: number): number;
export declare function toDeviceIndependentPixels(value: number): number;
export declare function measureNativeView(nativeView: any, width: number, widthMode: number, height: number, heightMode: number): {
    width: number;
    height: number;
};
