import { EventData, View } from "@nativescript/core/ui/core/view";
import { GesturesObserverBase, GestureTypes, SwipeDirection } from "@nativescript/core/ui/gestures/gestures-common";
export * from "@nativescript/core/ui/gestures/gestures-common";
export interface GestureEventData extends EventData {
    type: GestureTypes;
    view: View;
    ios: any;
    android: any;
    desktop: any;
}
export interface GestureEventDataWithState extends GestureEventData {
    state: number;
}
export interface PinchGestureEventData extends GestureEventDataWithState {
    scale: number;
    getFocusX(): number;
    getFocusY(): number;
}
export interface SwipeGestureEventData extends GestureEventData {
    direction: SwipeDirection;
}
export interface PanGestureEventData extends GestureEventDataWithState {
    deltaX: number;
    deltaY: number;
}
export interface RotationGestureEventData extends GestureEventDataWithState {
    rotation: number;
}
export declare function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver;
export declare class GesturesObserver extends GesturesObserverBase {
    private _recognizers;
    private _onTargetLoaded;
    private _onTargetUnloaded;
    constructor(target: View, callback: (args: GestureEventData) => void, context: any);
    androidOnTouchEvent(motionEvent: any): void;
    observe(type: GestureTypes): void;
    private _attach;
    private _detach;
    disconnect(): void;
    _executeCallback(args: GestureEventData): void;
    private _createRecognizer;
}
