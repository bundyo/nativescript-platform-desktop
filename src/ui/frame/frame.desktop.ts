// Definitions.
import { profile } from "@nativescript/core/profiling";
import { BackstackEntry, NavigationTransition, traceError } from "@nativescript/core/ui/frame";
//Types.
import { FrameBase, layout, NavigationType, traceCategories, traceEnabled, traceWrite, View } from "@nativescript/core/ui/frame/frame-common";
import { Page } from "@nativescript/core/ui/page";
import { QStackedWidget } from "@nodegui/nodegui";
import * as utils from "../../utils/utils.desktop";




export * from "@nativescript/core/ui/frame/frame-common";

const majorVersion = utils.desktop.MajorVersion;

const ENTRY = "_entry";
const DELEGATE = "_delegate";
const NAV_DEPTH = "_navDepth";
const TRANSITION = "_transition";
const NON_ANIMATED_TRANSITION = "non-animated";
const HMR_REPLACE_TRANSITION = "fade";

let navDepth = -1;

export class Frame extends FrameBase {
  public _desktop: QStackedWidget;
  public navBarVisibility: "auto" | "never" | "always";
  private _title: string = "NativeScript Application";
  private _disableNavBarAnimation: boolean;

  constructor() {
    super();

    this._desktop = new QStackedWidget();
    this._desktop.setObjectName(utils.uniqId());
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;

    this._desktop.setWindowTitle(title);
  }

  show() {
    this._desktop.show();
  }

  hide() {
    this._desktop.hide();
  }

  setMenuBar(menuBar) {
    (<FrameBase>this)._modalParent.desktop.setMenuBar(menuBar);
  }

  setMenuWidget(menuWidget) {
    (<FrameBase>this)._modalParent.desktop.setMenuWidget(menuWidget);
  }

  createNativeView() {
    return this._desktop;
  }

  public disposeNativeView() {
    (<FrameBase>this)._removeFromFrameStack();
    super.disposeNativeView();
  }

  public get desktop(): any {
    return this._desktop;
  }

  public setCurrent(
    entry: BackstackEntry,
    navigationType: NavigationType
  ): void {
    const current = (<FrameBase>this)._currentEntry;
    const currentEntryChanged = current !== entry;
    if (currentEntryChanged) {
      (<FrameBase>this)._updateBackstack(entry, navigationType);

      super.setCurrent(entry, navigationType);
    }
  }

  _createPage(entry) {
    if (!entry) {
      traceError(`onCreateView: entry is null or undefined`);
      return null;
    }

    const page = entry.resolvedPage;
    if (!page) {
      traceError(`onCreateView: entry has no resolvedPage`);
      return null;
    }

    if (!(<FrameBase>this)._styleScope) {
      // Make sure page will have styleScope even if parents don't.
      page._updateStyleScope();
    }

    (<FrameBase>this)._addView(page);

    if (page.parent === this) {
      // If we are navigating to a page that was destroyed
      // reinitialize its UI.
      if (!page._context) {
        page._setupUI({});
      }
    }

    if ((<FrameBase>this).isLoaded && !page.isLoaded) {
      page.callLoaded();
    }

    const savedState = entry.viewSavedState;
    if (savedState) {
      page.nativeViewProtected.restoreHierarchyState(savedState);
      entry.viewSavedState = null;
    }

    return page.nativeViewProtected;
  }

  @profile
  public _navigateCore(backstackEntry: BackstackEntry) {
    super._navigateCore(backstackEntry);

    let clearHistory = backstackEntry.entry.clearHistory;
    if (clearHistory) {
      navDepth = -1;
    }

    const isReplace =
      (<FrameBase>this)._executingContext &&
      (<FrameBase>this)._executingContext.navigationType ===
        NavigationType.replace;
    if (!isReplace) {
      navDepth++;
    }

    let navigationTransition: NavigationTransition;
    let animated = (<FrameBase>this).currentPage
      ? (<FrameBase>this)._getIsAnimatedNavigation(backstackEntry.entry)
      : false;
    if (isReplace) {
      animated = true;
      navigationTransition = { name: HMR_REPLACE_TRANSITION, duration: 100 };
      // viewController[TRANSITION] = navigationTransition;
    } else if (animated) {
      navigationTransition = (<FrameBase>this)._getNavigationTransition(
        backstackEntry.entry
      );
      if (navigationTransition) {
        // viewController[TRANSITION] = navigationTransition;
      }
    } else {
      //https://github.com/NativeScript/NativeScript/issues/1787
      // viewController[TRANSITION] = { name: NON_ANIMATED_TRANSITION };
    }
    //
    // let nativeTransition = _getNativeTransition(navigationTransition, true);
    // if (!nativeTransition && navigationTransition) {
    //     this._ios.controller.delegate = this._animatedDelegate;
    //     viewController[DELEGATE] = this._animatedDelegate;
    // }
    // else {
    //     viewController[DELEGATE] = null;
    //     this._ios.controller.delegate = null;
    // }

    backstackEntry[NAV_DEPTH] = navDepth;
    // viewController[ENTRY] = backstackEntry;
    //
    // if (!animated && majorVersion > 10) {
    //     // Reset back button title before pushing view controller to prevent
    //     // displaying default 'back' title (when NavigaitonButton custom title is set).
    //     let barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction("", UIBarButtonItemStyle.Plain, null, null);
    //     viewController.navigationItem.backBarButtonItem = barButtonItem;
    // }
    //
    // First navigation.
    //        if (!this._currentEntry) {
    // Update action-bar with disabled animations before the initial navigation.
    this._updateActionBar(backstackEntry.resolvedPage);

    let newWidget;

    if (backstackEntry.resolvedPage.nativeViewProtected) {
      newWidget = backstackEntry.resolvedPage.nativeViewProtected;
    } else {
      newWidget = this._createPage(backstackEntry);
      newWidget.setObjectName("root");

      this._desktop.addWidget(newWidget);
    }

    this._desktop.setCurrentWidget(newWidget);

    if (traceEnabled()) {
      traceWrite(
        `${this}.addWidget(${newWidget}, ${animated}); depth = ${navDepth}`,
        traceCategories.Navigation
      );
    }

    this.setCurrent(
      backstackEntry,
      (<FrameBase>this)._executingContext.navigationType
    );
    (<FrameBase>this)._processNavigationQueue(backstackEntry.resolvedPage);

    return;
    //        }

    // We should clear the entire history.
    // if (clearHistory) {
    //     viewController.navigationItem.hidesBackButton = true;
    //     const newControllers = NSMutableArray.alloc().initWithCapacity(1);
    //     newControllers.addObject(viewController);
    //
    //     // Mark all previous ViewControllers as cleared
    //     const oldControllers = this._ios.controller.viewControllers;
    //     for (let i = 0; i < oldControllers.count; i++) {
    //         (<any>oldControllers.objectAtIndex(i)).isBackstackCleared = true;
    //     }
    //
    //     this._ios.controller.setViewControllersAnimated(newControllers, animated);
    //     if (traceEnabled()) {
    //         traceWrite(`${this}.setViewControllersAnimated([${viewController}], ${animated}); depth = ${navDepth}`, traceCategories.Navigation);
    //     }
    //
    //     return;
    //
    // }
    //
    // // We should hide the current entry from the back stack.
    // // This is the case for HMR when NavigationType.replace.
    // if (!Frame._isEntryBackstackVisible(this._currentEntry) || isReplace) {
    //     let newControllers = NSMutableArray.alloc<UIViewController>().initWithArray(this._ios.controller.viewControllers);
    //     if (newControllers.count === 0) {
    //         throw new Error("Wrong controllers count.");
    //     }
    //
    //     // the code below fixes a phantom animation that appears on the Back button in this case
    //     // TODO: investigate why the animation happens at first place before working around it
    //     viewController.navigationItem.hidesBackButton = this.backStack.length === 0;
    //
    //     // swap the top entry with the new one
    //     const skippedNavController = newControllers.lastObject;
    //     (<any>skippedNavController).isBackstackSkipped = true;
    //     newControllers.removeLastObject();
    //     newControllers.addObject(viewController);
    //
    //     // replace the controllers instead of pushing directly
    //     this._ios.controller.setViewControllersAnimated(newControllers, animated);
    //     if (traceEnabled()) {
    //         traceWrite(`${this}.setViewControllersAnimated([originalControllers - lastController + ${viewController}], ${animated}); depth = ${navDepth}`, traceCategories.Navigation);
    //     }
    //
    //     return;
    // }
    //
    // General case.

    // this._desktop.setCentralWidget(backstackEntry.resolvedPage.nativeViewProtected);
    // if (traceEnabled()) {
    //     traceWrite(`${this}.setCentralWidget(${backstackEntry.resolvedPage.nativeViewProtected}, ${animated}); depth = ${navDepth}`, traceCategories.Navigation);
    // }
  }

  public _goBackCore(backstackEntry: BackstackEntry) {
    super._goBackCore(backstackEntry);
    navDepth = backstackEntry[NAV_DEPTH];

    // let controller = backstackEntry.resolvedPage.ios;
    let animated = (<FrameBase>this)._currentEntry
      ? (<FrameBase>this)._getIsAnimatedNavigation(
          (<FrameBase>this)._currentEntry.entry
        )
      : false;

    if (traceEnabled()) {
      traceWrite(
        `${this}.popToViewControllerAnimated(${animated}); depth = ${navDepth}`,
        traceCategories.Navigation
      );
    }

    this._navigateCore(backstackEntry);
  }

  public _updateActionBar(
    page?: Page,
    disableNavBarAnimation: boolean = false
  ): void {
    super._updateActionBar(page);

    // if (page && this.currentPage && this.currentPage.modal === page) {
    //     return;
    // }
    //
    // page = page || this.currentPage;
    // let newValue = this._getNavBarVisible(page);
    // let disableNavBarAnimationCache = this._ios._disableNavBarAnimation;
    //
    // if (disableNavBarAnimation) {
    //     this._ios._disableNavBarAnimation = true;
    // }
    //
    // this._ios.showNavigationBar = newValue;
    //
    // if (disableNavBarAnimation) {
    //     this._ios._disableNavBarAnimation = disableNavBarAnimationCache;
    // }
    //
    // if (this._ios.controller.navigationBar) {
    //     this._ios.controller.navigationBar.userInteractionEnabled = this.navigationQueueIsEmpty();
    // }
  }

  public _getNavBarVisible(page: Page): boolean {
    switch ((<FrameBase>this).actionBarVisibility) {
      case "always":
        return true;

      case "never":
        return false;

      case "auto":
      // switch (this._desktop) {
      //     case "always":
      //         return true;
      //
      //     case "never":
      //         return false;
      //
      //     case "auto":
      //         // let newValue: boolean;
      //         //
      //         // if (page && page.actionBarHidden !== undefined) {
      //         //     newValue = !page.actionBarHidden;
      //         // }
      //         // else {
      //         //     newValue = this.desktop.controller.viewControllers.count > 1 || (page && page.actionBar && !page.actionBar._isEmpty());
      //         // }
      //         //
      //         // newValue = !!newValue;
      //         //
      //         // return newValue;
      // }
    }
  }

  public static get defaultAnimatedNavigation(): boolean {
    return FrameBase.defaultAnimatedNavigation;
  }
  public static set defaultAnimatedNavigation(value: boolean) {
    FrameBase.defaultAnimatedNavigation = value;
  }

  public static get defaultTransition(): NavigationTransition {
    return FrameBase.defaultTransition;
  }
  public static set defaultTransition(value: NavigationTransition) {
    FrameBase.defaultTransition = value;
  }

  public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
    const width = layout.getMeasureSpecSize(widthMeasureSpec);
    const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

    const height = layout.getMeasureSpecSize(heightMeasureSpec);
    const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);

    const widthAndState = View.resolveSizeAndState(width, width, widthMode, 0);
    const heightAndState = View.resolveSizeAndState(
      height,
      height,
      heightMode,
      0
    );

    (<FrameBase>this).setMeasuredDimension(widthAndState, heightAndState);
  }

  public layoutNativeView(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): void {
    //
  }

  public _setNativeViewFrame(nativeView: View, frame: any) {
    //
  }
}

// let transitionDelegates = new Array<TransitionDelegate>();
//
// class TransitionDelegate {
//     private _id: string;
//
//     public static initWithOwnerId(id: string): any {
//         // let delegate = <TransitionDelegate>TransitionDelegate.new();
//         // delegate._id = id;
//         // transitionDelegates.push(delegate);
//         //
//         // return delegate;
//     }
//
//     public animationWillStart(animationID: string, context: any): void {
//         if (traceEnabled()) {
//             traceWrite(`START ${this._id}`, traceCategories.Transition);
//         }
//     }
//
//     public animationDidStop(animationID: string, finished: boolean, context: any): void {
//         if (finished) {
//             if (traceEnabled()) {
//                 traceWrite(`END ${this._id}`, traceCategories.Transition);
//             }
//         }
//         else {
//             if (traceEnabled()) {
//                 traceWrite(`CANCEL ${this._id}`, traceCategories.Transition);
//             }
//         }
//
//         let index = transitionDelegates.indexOf(this);
//         if (index > -1) {
//             transitionDelegates.splice(index, 1);
//         }
//     }
// }

const _defaultTransitionDuration = 0.35;

//
// function _getTransitionId(nativeTransition: UIViewAnimationTransition, transitionType: string): string {
//     let name;
//     switch (nativeTransition) {
//         case UIViewAnimationTransition.CurlDown: name = "CurlDown"; break;
//         case UIViewAnimationTransition.CurlUp: name = "CurlUp"; break;
//         case UIViewAnimationTransition.FlipFromLeft: name = "FlipFromLeft"; break;
//         case UIViewAnimationTransition.FlipFromRight: name = "FlipFromRight"; break;
//         case UIViewAnimationTransition.None: name = "None"; break;
//     }
//
//     return `${name} ${transitionType}`;
// }
//
// function _getNativeTransition(navigationTransition: NavigationTransition, push: boolean): UIViewAnimationTransition {
//     if (navigationTransition && navigationTransition.name) {
//         switch (navigationTransition.name.toLowerCase()) {
//             case "flip":
//             case "flipright":
//                 return push ? UIViewAnimationTransition.FlipFromRight : UIViewAnimationTransition.FlipFromLeft;
//             case "flipleft":
//                 return push ? UIViewAnimationTransition.FlipFromLeft : UIViewAnimationTransition.FlipFromRight;
//             case "curl":
//             case "curlup":
//                 return push ? UIViewAnimationTransition.CurlUp : UIViewAnimationTransition.CurlDown;
//             case "curldown":
//                 return push ? UIViewAnimationTransition.CurlDown : UIViewAnimationTransition.CurlUp;
//         }
//     }
//
//     return null;
// }
//
// export function _getNativeCurve(transition: NavigationTransition): UIViewAnimationCurve {
//     if (transition.curve) {
//         switch (transition.curve) {
//             case "easeIn":
//                 if (traceEnabled()) {
//                     traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseIn.", traceCategories.Transition);
//                 }
//
//                 return UIViewAnimationCurve.EaseIn;
//
//             case "easeOut":
//                 if (traceEnabled()) {
//                     traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseOut.", traceCategories.Transition);
//                 }
//
//                 return UIViewAnimationCurve.EaseOut;
//
//             case "easeInOut":
//                 if (traceEnabled()) {
//                     traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseInOut.", traceCategories.Transition);
//                 }
//
//                 return UIViewAnimationCurve.EaseInOut;
//
//             case "linear":
//                 if (traceEnabled()) {
//                     traceWrite("Transition curve resolved to UIViewAnimationCurve.Linear.", traceCategories.Transition);
//                 }
//
//                 return UIViewAnimationCurve.Linear;
//
//             default:
//                 if (traceEnabled()) {
//                     traceWrite("Transition curve resolved to original: " + transition.curve, traceCategories.Transition);
//                 }
//
//                 return transition.curve;
//         }
//     }
//
//     return UIViewAnimationCurve.EaseInOut;
// }

// /* tslint:disable */
// class DesktopFrame implements DesktopFrameDefinition {
//     /* tslint:enable */
//     private _showNavigationBar: boolean;
//     private _navBarVisibility: "auto" | "never" | "always" = "auto";
//
//     // TabView uses this flag to disable animation while showing/hiding the navigation bar because of the "< More" bar.
//     // See the TabView._handleTwoNavigationBars method for more details.
//     public _disableNavBarAnimation: boolean;
//
//     constructor(frame: Frame) {
//         // this._controller = UINavigationControllerImpl.initWithOwner(new WeakRef(frame));
//     }
//
//     public get controller() {
//         return null; // return this._controller;
//     }
//     public set controller(value: any) {
//         // this._controller = value;
//     }
//
//     public get showNavigationBar(): boolean {
//         return this._showNavigationBar;
//     }
//     public set showNavigationBar(value: boolean) {
//         this._showNavigationBar = value;
//         // this._controller.setNavigationBarHiddenAnimated(!value, !this._disableNavBarAnimation);
//     }
//
//     public get navBarVisibility(): "auto" | "never" | "always" {
//         return this._navBarVisibility;
//     }
//     public set navBarVisibility(value: "auto" | "never" | "always") {
//         this._navBarVisibility = value;
//     }
// }
