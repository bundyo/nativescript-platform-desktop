import * as definition from "@nativescript/core/fps-meter/fps-native";
export declare class FPSCallback implements definition.FPSCallback {
    running: boolean;
    private onFrame;
    private impl;
    constructor(onFrame: (currentTimeMillis: number) => void);
    start(): void;
    stop(): void;
    _handleFrame(sender: any): void;
}
