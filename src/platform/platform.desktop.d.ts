import { Device as DeviceDefinition, ScreenMetrics as ScreenMetricsDefinition } from "@nativescript/core/platform";
export declare module platformNames {
    const android = "Android";
    const ios = "iOS";
    const desktop = "Desktop";
}
declare class Device implements DeviceDefinition {
    private _manufacturer;
    private _model;
    private _osVersion;
    private _sdkVersion;
    private _uuid;
    private _language;
    private _region;
    get manufacturer(): string;
    get os(): string;
    get osVersion(): string;
    get model(): string;
    get sdkVersion(): string;
    get deviceType(): "Desktop" | any;
    get uuid(): string;
    get language(): string;
    get region(): string;
}
declare class MainScreen implements ScreenMetricsDefinition {
    private reinitMetrics;
    private initMetrics;
    private get metrics();
    get widthPixels(): number;
    get heightPixels(): number;
    get scale(): number;
    get widthDIPs(): number;
    get heightDIPs(): number;
}
export declare const device: Device;
export declare module screen {
    const mainScreen: MainScreen;
}
export declare const isAndroid = false;
export declare const isIOS = false;
export declare const isDesktop = true;
export {};
