import { categories as traceCategories, messageType as traceMessageType, write as traceWrite } from "@nativescript/core/trace";
import { layoutCommon } from "@nativescript/core/utils/utils-common";


export * from "@nativescript/core/utils/utils-common";

let mainScreenScale;

function isOrientationLandscape(orientation: number) {
  return false; // orientation === UIDeviceOrientation.LandscapeLeft /* 3 */ ||
  // orientation === UIDeviceOrientation.LandscapeRight /* 4 */;
}

export function uniqId() {
  return `a${Math.random()
    .toString(36)
    .substr(2, 10)}`;
}

export module layout {
  const MODE_SHIFT = 30;
  const MODE_MASK = 0x3 << MODE_SHIFT;

  export function makeMeasureSpec(size: number, mode: number): number {
    return (Math.round(Math.max(0, size)) & ~MODE_MASK) | (mode & MODE_MASK);
  }

  export function getDisplayDensity(): number {
    return mainScreenScale;
  }

  export function toDevicePixels(value: number): number {
    return value * mainScreenScale;
  }

  export function toDeviceIndependentPixels(value: number): number {
    return value / mainScreenScale;
  }

  export function measureNativeView(
    nativeView: any /* UIView */,
    width: number,
    widthMode: number,
    height: number,
    heightMode: number
  ): { width: number; height: number } {
    // const nativeSize = nativeView.sizeThatFits({
    //     width: widthMode === 0 /* layout.UNSPECIFIED */ ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(width),
    //     height: heightMode === 0 /* layout.UNSPECIFIED */ ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(height)
    // });
    //
    // nativeSize.width = layoutCommon.round(toDevicePixels(nativeSize.width));
    // nativeSize.height = layoutCommon.round(toDevicePixels(nativeSize.height));

    return { width: 0, height: 0 }; // nativeSize;
  }
}

// TODO(webpack-workflow): Export all methods from layoutCommon
// Think of a cleaner way to do that
Object.assign(layout, layoutCommon);

export module desktop {
  // TODO: remove for NativeScript 7.0
  export function getter<T>(_this: any, property: T | { (): T }): T {
    console.log(
      "utils.ios.getter() is deprecated; use the respective native property instead"
    );
    if (typeof property === "function") {
      return (<{ (): T }>property).call(_this);
    } else {
      return <T>property;
    }
  }

  export module collections {
    export function jsArrayToNSArray(str: string[]): any {
      // return NSArray.arrayWithArray(<any>str);
    }

    export function nsArrayToJSArray(a: any): any {
      // const arr = [];
      // if (a !== undefined) {
      //     let count = a.count;
      //     for (let i = 0; i < count; i++) {
      //         arr.push(a.objectAtIndex(i));
      //     }
      // }
      //
      // return arr;
    }
  }

  export function isLandscape(): boolean {
    console.log(
      "utils.ios.isLandscape() is deprecated; use application.orientation instead"
    );

    const deviceOrientation = null; // UIDevice.currentDevice.orientation;
    const statusBarOrientation = null; // UIApplication.sharedApplication.statusBarOrientation;

    const isDeviceOrientationLandscape = isOrientationLandscape(
      deviceOrientation
    );
    const isStatusBarOrientationLandscape = isOrientationLandscape(
      statusBarOrientation
    );

    return isDeviceOrientationLandscape || isStatusBarOrientationLandscape;
  }

  export const MajorVersion = 10; // NSString.stringWithString(UIDevice.currentDevice.systemVersion).intValue;

  export function openFile(filePath: string): boolean {
    console.log(
      "utils.ios.openFile() is deprecated; use utils.openFile() instead"
    );

    return openFileAtRootModule(filePath);
  }

  export function getCurrentAppPath(): string {
    const currentDir = __dirname;
    const tnsModulesIndex = currentDir.indexOf("/tns_modules");

    // Module not hosted in ~/tns_modules when bundled. Use current dir.
    let appPath = currentDir;
    if (tnsModulesIndex !== -1) {
      // Strip part after tns_modules to obtain app root
      appPath = currentDir.substring(0, tnsModulesIndex);
    }

    return appPath;
  }

  export function joinPaths(...paths: string[]): string {
    if (!paths || paths.length === 0) {
      return "";
    }

    return paths.join("/"); //NSString.stringWithString(NSString.pathWithComponents(<any>paths)).stringByStandardizingPath;
  }

  // export function getVisibleViewController(rootViewController: UIViewController): UIViewController {
  //     if (rootViewController.presentedViewController) {
  //         return getVisibleViewController(rootViewController.presentedViewController);
  //     }
  //
  //     if (rootViewController.isKindOfClass(UINavigationController.class())) {
  //         return getVisibleViewController((<UINavigationController>rootViewController).visibleViewController);
  //     }
  //
  //     if (rootViewController.isKindOfClass(UITabBarController.class())) {
  //         return getVisibleViewController(<UITabBarController>rootViewController);
  //     }
  //
  //     return rootViewController;
  //
  // }
}

export function openFile(filePath: string): boolean {
  try {
    const appPath = desktop.getCurrentAppPath();
    const path = filePath.replace("~", appPath);

    // const controller = UIDocumentInteractionController.interactionControllerWithURL(NSURL.fileURLWithPath(path));
    // controller.delegate = new UIDocumentInteractionControllerDelegateImpl();

    return false; // controller.presentPreviewAnimated(true);
  } catch (e) {
    traceWrite(
      "Error in openFile",
      traceCategories.Error,
      traceMessageType.error
    );
  }

  return false;
}

// Need this so that we can use this function inside the ios module (avoid name clashing).
const openFileAtRootModule = openFile;

export function GC() {
  //__collect();
}

export function openUrl(location: string): boolean {
  try {
    // const url = NSURL.URLWithString(location.trim());
    // if (UIApplication.sharedApplication.canOpenURL(url)) {
    //     return UIApplication.sharedApplication.openURL(url);
    // }
  } catch (e) {
    // We Don't do anything with an error.  We just output it
    traceWrite(
      "Error in OpenURL",
      traceCategories.Error,
      traceMessageType.error
    );
  }

  return false;
}

// class UIDocumentInteractionControllerDelegateImpl extends NSObject implements UIDocumentInteractionControllerDelegate {
//     public static ObjCProtocols = [UIDocumentInteractionControllerDelegate];
//
//     public getViewController(): UIViewController {
//         const app = UIApplication.sharedApplication;
//
//         return app.keyWindow.rootViewController;
//     }
//
//     public documentInteractionControllerViewControllerForPreview(controller: UIDocumentInteractionController) {
//         return this.getViewController();
//     }
//
//     public documentInteractionControllerViewForPreview(controller: UIDocumentInteractionController) {
//         return this.getViewController().view;
//     }
//
//     public documentInteractionControllerRectForPreview(controller: UIDocumentInteractionController): CGRect {
//         return this.getViewController().view.frame;
//     }
// }
//
mainScreenScale = 1; //UIScreen.mainScreen.scale;

export class WeakRef {
  private _target: any;

  constructor(target) {
    if (target instanceof WeakRef) {
      this._target = target.get();
    } else {
      this._target = target;
    }
  }

  get() {
    return this._target;
  }

  clear() {
    delete this._target;
  }
}

(<any>global).WeakRef = WeakRef;
