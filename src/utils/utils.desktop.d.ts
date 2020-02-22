export * from "@nativescript/core/utils/utils-common";
export declare function uniqId(): string;
export declare module layout {
    function makeMeasureSpec(size: number, mode: number): number;
    function getDisplayDensity(): number;
    function toDevicePixels(value: number): number;
    function toDeviceIndependentPixels(value: number): number;
    function measureNativeView(nativeView: any, width: number, widthMode: number, height: number, heightMode: number): {
        width: number;
        height: number;
    };
}
export declare module desktop {
    function getter<T>(_this: any, property: T | {
        (): T;
    }): T;
    module collections {
        function jsArrayToNSArray(str: string[]): any;
        function nsArrayToJSArray(a: any): any;
    }
    function isLandscape(): boolean;
    const MajorVersion = 10;
    function openFile(filePath: string): boolean;
    function getCurrentAppPath(): string;
    function joinPaths(...paths: string[]): string;
}
export declare function openFile(filePath: string): boolean;
export declare function GC(): void;
export declare function openUrl(location: string): boolean;
export declare class WeakRef {
    private _target;
    constructor(target: any);
    get(): any;
    clear(): void;
}
