// Definitions.
import {EventData, View} from "@nativescript/core/ui/core/view";
// Types.
import {GesturesObserverBase, GestureTypes, SwipeDirection, toString, TouchAction} from "@nativescript/core/ui/gestures/gestures-common";

export * from "@nativescript/core/ui/gestures/gestures-common";

export interface GestureEventData extends EventData {
    /**
     * Gets the type of the gesture.
     */
    type: GestureTypes;
    /**
     * Gets the view which originates the gesture.
     */
    view: View;
    /**
     * Gets the underlying native iOS specific [UIGestureRecognizer](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIGestureRecognizer_Class/).
     */
    ios: any /* UIGestureRecognizer */;
    /**
     * Gets the underlying native android specific [gesture detector](http://developer.android.com/reference/android/view/GestureDetector.html).
     */
    android: any,

    desktop: any
}

export interface GestureEventDataWithState extends GestureEventData {
    state: number;
}

/**
 * Provides gesture event data for pinch gesture.
 */
export interface PinchGestureEventData extends GestureEventDataWithState {
    scale: number;

    getFocusX(): number;
    getFocusY(): number;
}

/**
 * Provides gesture event data for swipe gesture.
 */
export interface SwipeGestureEventData extends GestureEventData {
    direction: SwipeDirection;
}

/**
 * Provides gesture event data for pan gesture.
 */
export interface PanGestureEventData extends GestureEventDataWithState {
    deltaX: number;
    deltaY: number;
}

/**
 * Provides gesture event data for rotation gesture.
 */
export interface RotationGestureEventData extends GestureEventDataWithState {
    rotation: number;
}



export function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver {
    const observer = new GesturesObserver(target, callback, context);
    observer.observe(type);

    return observer;
}

// class UIGestureRecognizerDelegateImpl extends NSObject implements UIGestureRecognizerDelegate {
//     public static ObjCProtocols = [UIGestureRecognizerDelegate];
//
//     public gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer(gestureRecognizer: UIGestureRecognizer, otherGestureRecognizer: UIGestureRecognizer): boolean {
//         return true;
//     }
//
//     public gestureRecognizerShouldRequireFailureOfGestureRecognizer(gestureRecognizer: UIGestureRecognizer, otherGestureRecognizer: UIGestureRecognizer): boolean {
//         // If both gesture recognizers are of type UITapGestureRecognizer & one of them is a doubleTap,
//         // we must require a failure.
//         if (gestureRecognizer instanceof UITapGestureRecognizer
//             && otherGestureRecognizer instanceof UITapGestureRecognizer
//             && otherGestureRecognizer.numberOfTapsRequired === 2) {
//             return true;
//         }
//
//         return false;
//     }
// }
// let recognizerDelegateInstance: UIGestureRecognizerDelegateImpl = <UIGestureRecognizerDelegateImpl>UIGestureRecognizerDelegateImpl.new();

// class UIGestureRecognizerImpl extends NSObject {
//     public static ObjCExposedMethods = {
//         "recognize": { returns: interop.types.void, params: [UIGestureRecognizer] }
//     };
//
//     private _owner: WeakRef<GesturesObserver>;
//     private _type: any;
//     private _callback: Function;
//     private _context: any;
//
//     public static initWithOwnerTypeCallback(owner: WeakRef<GesturesObserver>, type: any, callback?: Function, thisArg?: any): UIGestureRecognizerImpl {
//         const handler = <UIGestureRecognizerImpl>UIGestureRecognizerImpl.new();
//         handler._owner = owner;
//         handler._type = type;
//
//         if (callback) {
//             handler._callback = callback;
//         }
//
//         if (thisArg) {
//             handler._context = thisArg;
//         }
//
//         return handler;
//     }
//
//     public recognize(recognizer: UIGestureRecognizer): void {
//         const owner = this._owner.get();
//         const callback = this._callback ? this._callback : (owner ? owner.callback : null);
//         const typeParam = this._type;
//         const target = owner ? owner.target : undefined;
//
//         const args = {
//             type: typeParam,
//             view: target,
//             ios: recognizer,
//             android: undefined,
//             object: target,
//             eventName: toString(typeParam),
//         };
//
//         if (callback) {
//             callback.call(this._context, args);
//         }
//     }
// }

export class GesturesObserver extends GesturesObserverBase {
    private _recognizers: {};

    private _onTargetLoaded: (data: EventData) => void;
    private _onTargetUnloaded: (data: EventData) => void;

    constructor(target: View, callback: (args: GestureEventData) => void, context: any) {
        super(target, callback, context);
        this._recognizers = {};
    }

    public androidOnTouchEvent(motionEvent): void {
        //
    }

    public observe(type: GestureTypes) {
        if (super.target) {
            super.type = type;
            this._onTargetLoaded = args => {
                this._attach(super.target, type);
            };
            this._onTargetUnloaded = args => {
                this._detach();
            };

            super.target.on("loaded", this._onTargetLoaded);
            super.target.on("unloaded", this._onTargetUnloaded);

            if (super.target.isLoaded) {
                this._attach(super.target, type);
            }
        }
    }

    private _attach(target: View, type: GestureTypes) {
        this._detach();

        if (target && target.nativeViewProtected && target.nativeViewProtected.addGestureRecognizer) {
            const nativeView = target.nativeViewProtected;

            if (type & GestureTypes.tap) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.tap));
            }

            if (type & GestureTypes.doubleTap) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.doubleTap));
            }

            if (type & GestureTypes.pinch) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.pinch, args => {
                    this._executeCallback(_getPinchData(args));
                }));
            }

            if (type & GestureTypes.pan) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.pan, args => {
                    this._executeCallback(_getPanData(args, target.nativeViewProtected));
                }));
            }

            // if (type & GestureTypes.swipe) {
            //     nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.swipe, args => {
            //         this._executeCallback(_getSwipeData(args));
            //     }, UISwipeGestureRecognizerDirection.Down));
            //
            //     nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.swipe, args => {
            //         this._executeCallback(_getSwipeData(args));
            //     }, UISwipeGestureRecognizerDirection.Left));
            //
            //     nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.swipe, args => {
            //         this._executeCallback(_getSwipeData(args));
            //     }, UISwipeGestureRecognizerDirection.Right));
            //
            //     nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.swipe, args => {
            //         this._executeCallback(_getSwipeData(args));
            //     }, UISwipeGestureRecognizerDirection.Up));
            // }

            if (type & GestureTypes.rotation) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.rotation, args => {
                    this._executeCallback(_getRotationData(args));
                }));
            }

            if (type & GestureTypes.longPress) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.longPress));
            }

            if (type & GestureTypes.touch) {
                nativeView.addGestureRecognizer(this._createRecognizer(GestureTypes.touch));
            }
        }
    }

    private _detach() {
        if (super.target && super.target.nativeViewProtected) {
            for (let name in this._recognizers) {
                if (this._recognizers.hasOwnProperty(name)) {
                    let item = <RecognizerCache>this._recognizers[name];
                    super.target.nativeViewProtected.removeGestureRecognizer(item.recognizer);

                    item.recognizer = null;
                    item.target = null;
                }
            }
            this._recognizers = {};
        }
    }

    public disconnect() {
        this._detach();

        if (super.target) {
            super.target.off("loaded", this._onTargetLoaded);
            super.target.off("unloaded", this._onTargetUnloaded);

            this._onTargetLoaded = null;
            this._onTargetUnloaded = null;
        }
        // clears target, context and callback references
        super.disconnect();
    }

    public _executeCallback(args: GestureEventData) {
        if (super.callback) {
            super.callback.call(super.context, args);
        }
    }

    private _createRecognizer(type: GestureTypes, callback?: (args: GestureEventData) => void, swipeDirection?: any): any {
        let recognizer: any;
        let name = toString(type);
        // const target = _createUIGestureRecognizerTarget(this, type, callback, this.context);
        // const recognizerType = _getUIGestureRecognizerType(type);

        // if (recognizerType) {
        //     recognizer = recognizerType.alloc().initWithTargetAction(target, "recognize");
        //
        //     if (type === GestureTypes.swipe && swipeDirection) {
        //         name = name + swipeDirection.toString();
        //         (<UISwipeGestureRecognizer>recognizer).direction = swipeDirection;
        //     } else if (type === GestureTypes.touch) {
        //         (<TouchGestureRecognizer>recognizer).observer = this;
        //     } else if (type === GestureTypes.doubleTap) {
        //         (<UITapGestureRecognizer>recognizer).numberOfTapsRequired = 2;
        //     }
        //
        //     if (recognizer) {
        //         recognizer.delegate = recognizerDelegateInstance;
        //         this._recognizers[name] = <RecognizerCache>{ recognizer: recognizer, target: target };
        //     }
        // }

        return recognizer;
    }
}

function _createUIGestureRecognizerTarget(owner: GesturesObserver, type: GestureTypes, callback?: (args: GestureEventData) => void, context?: any): any {
    // return UIGestureRecognizerImpl.initWithOwnerTypeCallback(new WeakRef(owner), type, callback, context);
}

interface RecognizerCache {
    recognizer: any;
    target: any;
}

// function _getUIGestureRecognizerType(type: GestureTypes): any {
//     let nativeType = null;
//
//     if (type === GestureTypes.tap) {
//         nativeType = UITapGestureRecognizer;
//     } else if (type === GestureTypes.doubleTap) {
//         nativeType = UITapGestureRecognizer;
//     } else if (type === GestureTypes.pinch) {
//         nativeType = UIPinchGestureRecognizer;
//     } else if (type === GestureTypes.pan) {
//         nativeType = UIPanGestureRecognizer;
//     } else if (type === GestureTypes.swipe) {
//         nativeType = UISwipeGestureRecognizer;
//     } else if (type === GestureTypes.rotation) {
//         nativeType = UIRotationGestureRecognizer;
//     } else if (type === GestureTypes.longPress) {
//         nativeType = UILongPressGestureRecognizer;
//     } else if (type === GestureTypes.touch) {
//         nativeType = TouchGestureRecognizer;
//     }
//
//     return nativeType;
// }

function getState(recognizer: any): any {
    // if (recognizer.state === UIGestureRecognizerState.Began) {
    //     return GestureStateTypes.began;
    // } else if (recognizer.state === UIGestureRecognizerState.Cancelled) {
    //     return GestureStateTypes.cancelled;
    // } else if (recognizer.state === UIGestureRecognizerState.Changed) {
    //     return GestureStateTypes.changed;
    // } else if (recognizer.state === UIGestureRecognizerState.Ended) {
    //     return GestureStateTypes.ended;
    // }
}

function _getSwipeDirection(direction: any): SwipeDirection {
    // if (direction === UISwipeGestureRecognizerDirection.Down) {
    //     return SwipeDirection.down;
    // } else if (direction === UISwipeGestureRecognizerDirection.Left) {
    //     return SwipeDirection.left;
    // } else if (direction === UISwipeGestureRecognizerDirection.Right) {
    //     return SwipeDirection.right;
    // } else if (direction === UISwipeGestureRecognizerDirection.Up) {
    //     return SwipeDirection.up;
    // }
    return SwipeDirection.down;
}

function _getPinchData(args: GestureEventData): PinchGestureEventData {
    const recognizer = args.desktop;
    const center = recognizer.locationInView(args.view.nativeViewProtected);

    return {
        type: args.type,
        view: args.view,
        ios: undefined,
        android: undefined,
        desktop: args.desktop,
        scale: recognizer.scale,
        getFocusX: () => center.x,
        getFocusY: () => center.y,
        object: args.view,
        eventName: toString(args.type),
        state: getState(recognizer)
    };
}

function _getSwipeData(args: GestureEventData): SwipeGestureEventData {
    const recognizer = args.desktop;

    return <SwipeGestureEventData>{
        type: args.type,
        view: args.view,
        ios: undefined,
        android: undefined,
        desktop: args.desktop,
        direction: _getSwipeDirection(recognizer.direction),
        object: args.view,
        eventName: toString(args.type),
    };
}

function _getPanData(args: GestureEventData, view: any): PanGestureEventData {
    const recognizer = args.desktop;

    return <PanGestureEventData>{
        type: args.type,
        view: args.view,
        ios: undefined,
        android: undefined,
        desktop: args.desktop,
        deltaX: recognizer.translationInView(view).x,
        deltaY: recognizer.translationInView(view).y,
        object: args.view,
        eventName: toString(args.type),
        state: getState(recognizer)
    };
}

function _getRotationData(args: GestureEventData): RotationGestureEventData {
    const recognizer = args.desktop;

    return <RotationGestureEventData>{
        type: args.type,
        view: args.view,
        ios: undefined,
        android: undefined,
        desktop: args.desktop,
        rotation: recognizer.rotation * (180.0 / Math.PI),
        object: args.view,
        eventName: toString(args.type),
        state: getState(recognizer)
    };
}

class TouchGestureRecognizer {
    public observer: GesturesObserver;
    private _eventData: TouchGestureEventData;

    touchesBeganWithEvent(touches: Set<any>, event: any): void {
        this.executeCallback(TouchAction.down, touches, event);
        // if (this.view) {
        //     this.view.touchesBeganWithEvent(touches, event);
        // }
    }

    touchesMovedWithEvent(touches: Set<any>, event: any): void {
        this.executeCallback(TouchAction.move, touches, event);
        // if (this.view) {
        //     this.view.touchesMovedWithEvent(touches, event);
        // }
    }

    touchesEndedWithEvent(touches: Set<any>, event: any): void {
        this.executeCallback(TouchAction.up, touches, event);
        // if (this.view) {
        //     this.view.touchesEndedWithEvent(touches, event);
        // }
    }

    touchesCancelledWithEvent(touches: Set<any>, event: any): void {
        this.executeCallback(TouchAction.cancel, touches, event);
        // if (this.view) {
        //     this.view.touchesCancelledWithEvent(touches, event);
        // }
    }

    private executeCallback(action: string, touches: Set<any>, event: any): void {
        if (!this._eventData) {
            this._eventData = new TouchGestureEventData();
        }

        this._eventData.prepare((<GesturesObserverBase>this.observer).target, action, touches, event);
        // this.observer._executeCallback(this._eventData);
    }
}

class Pointer implements Pointer {
    public android: any = undefined;
    public ios = undefined;
    public desktop = undefined;

    private _view: View;

    private _location: any;

    private get location(): any {
        if (!this._location) {
            this._location = this.desktop.locationInView(this._view.nativeViewProtected);
        }

        return this._location;
    }

    constructor(touch: any, targetView: View) {
        this.desktop = touch;
        this._view = targetView;
    }

    getX(): number {
        return this.location.x;
    }

    getY(): number {
        return this.location.y;
    }
}

class TouchGestureEventData implements TouchGestureEventData {
    eventName: string = toString(GestureTypes.touch);
    type: GestureTypes = GestureTypes.touch;
    android: any = undefined;
    action: string;
    view: View;
    desktop: { touches: Set<any>, event: any };
    object: any;

    private _activePointers: Array<Pointer>;
    private _allPointers: Array<Pointer>;
    private _mainPointer: any;

    public prepare(view: View, action: string, touches: Set<any>, event: any) {
        this.action = action;
        this.view = view;
        this.object = view;
        this.desktop = {
            touches: touches,
            event: event
        };

        this._mainPointer = undefined;
        this._activePointers = undefined;
        this._allPointers = undefined;
    }

    getPointerCount(): number {
        return this.desktop.event.allTouches.count;
    }

    private getMainPointer(): any {
        if (this._mainPointer === undefined) {
            this._mainPointer = this.desktop.touches;
        }

        return this._mainPointer;
    }

    getActivePointers(): Array<Pointer> {
        if (!this._activePointers) {
            this._activePointers = [];

            // for (let i = 0, nsArr = this.desktop.touches; i < nsArr.size; i++) {
                // this._activePointers.push(new Pointer(nsArr.objectAtIndex(i), this.view));
            // }
        }

        return this._activePointers;
    }

    getAllPointers(): Array<Pointer> {
        if (!this._allPointers) {
            this._allPointers = [];

            let nsArr = this.desktop.event.allTouches.allObjects;
            for (let i = 0; i < nsArr.count; i++) {
                this._allPointers.push(new Pointer(nsArr.objectAtIndex(i), this.view));
            }
        }

        return this._allPointers;
    }

    getX(): number {
        return this.getMainPointer().locationInView(this.view.nativeViewProtected).x;
    }

    getY(): number {
        return this.getMainPointer().locationInView(this.view.nativeViewProtected).y;
    }
}
