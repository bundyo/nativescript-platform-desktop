import { Font as FontBase, FontWeight } from "@nativescript/core/ui/styling/font-common";
export * from "@nativescript/core/ui/styling/font-common";
export declare class Font extends FontBase {
    static default: Font;
    constructor(family: string, size: number, style: "normal" | "italic", weight: FontWeight);
    withFontFamily(family: string): Font;
    withFontStyle(style: "normal" | "italic"): Font;
    withFontWeight(weight: FontWeight): Font;
    withFontSize(size: number): Font;
    getAndroidTypeface(): any;
    getUIFont(defaultFont: any): any;
}
