import { isScrollEnabledProperty, isUserInteractionEnabledProperty, layout, scrollBarIndicatorVisibleProperty, ScrollViewBase, ViewBase } from "@nativescript/core/ui/scroll-view/scroll-view-common";
import { QApplication, QScrollArea, QStylePixelMetric, WidgetEventTypes } from "@nodegui/nodegui";
import { uniqId } from "../../utils/utils.desktop";
import { View, ViewCommon } from "../core/view/view.desktop";

export * from "@nativescript/core/ui/scroll-view/scroll-view-common";

export class ScrollView extends ScrollViewBase {
  nativeViewProtected: QScrollArea;
  private _scrollBarSize: number;

  get horizontalOffset(): number {
    const nativeView = this.nativeViewProtected;
    if (!nativeView) {
      return 0;
    }

    // return nativeView.getScrollX() / layout.getDisplayDensity();
  }

  get verticalOffset(): number {
    const nativeView = this.nativeViewProtected;
    if (!nativeView) {
      return 0;
    }

    // return nativeView.getScrollY() / layout.getDisplayDensity();
  }

  get scrollableWidth(): number {
    const nativeView = this.nativeViewProtected;
    if (!nativeView || (<ScrollViewBase>this).orientation !== "horizontal") {
      return 0;
    }

    // return nativeView.getScrollableLength() / layout.getDisplayDensity();
  }

  get scrollableHeight(): number {
    const nativeView = this.nativeViewProtected;
    if (!nativeView || (<ScrollViewBase>this).orientation !== "vertical") {
      return 0;
    }

    // return nativeView.getScrollableLength() / layout.getDisplayDensity();
  }

  [isUserInteractionEnabledProperty.setNative](value: boolean) {
    // NOTE: different behavior on iOS & Android:
    // iOS disables user interaction recursively for all subviews as well
    // this.nativeViewProtected.setClickable(value);
    // this.nativeViewProtected.setFocusable(value);
    // this.nativeViewProtected.setScrollEnabled(value);
  }

  [isScrollEnabledProperty.getDefault]() {
    // return this.nativeViewProtected.getScrollEnabled();
  }
  [isScrollEnabledProperty.setNative](value: boolean) {
    // this.nativeViewProtected.setScrollEnabled(value);
  }

  [scrollBarIndicatorVisibleProperty.getDefault](): boolean {
    return true;
  }
  [scrollBarIndicatorVisibleProperty.setNative](value: boolean) {
    if ((<ScrollViewBase>this).orientation === "horizontal") {
      // this.nativeViewProtected.setHorizontalScrollBarEnabled(value);
    } else {
      // this.nativeViewProtected.setVerticalScrollBarEnabled(value);
    }
  }

  public scrollToVerticalOffset(value: number, animated: boolean) {
    const nativeView = this.nativeViewProtected;
    if (
      nativeView &&
      (<ScrollViewBase>this).orientation === "vertical" &&
      (<ScrollViewBase>this).isScrollEnabled
    ) {
      value *= layout.getDisplayDensity();

      if (animated) {
        // nativeView.smoothScrollTo(0, value);
      } else {
        // nativeView.scrollTo(0, value);
      }
    }
  }

  public scrollToHorizontalOffset(value: number, animated: boolean) {
    const nativeView = this.nativeViewProtected;
    if (
      nativeView &&
      (<ScrollViewBase>this).orientation === "horizontal" &&
      (<ScrollViewBase>this).isScrollEnabled
    ) {
      value *= layout.getDisplayDensity();

      if (animated) {
        // nativeView.smoothScrollTo(value, 0);
      } else {
        // nativeView.scrollTo(value, 0);
      }
    }
  }

  public createNativeView() {
    const view = new QScrollArea();
    view.setObjectName(uniqId());
    view.setWidgetResizable(true);

    this._scrollBarSize = QApplication.style().pixelMetric(
      QStylePixelMetric.PM_ScrollBarExtent
    );

    return view;
  }

  _addViewToNativeVisualTree(view: ViewBase, atIndex?: number): boolean {
    view.nativeViewProtected.show();
    this.nativeViewProtected.setWidget(view.nativeViewProtected);

    (<ScrollViewBase>this).parentNode.nativeViewProtected.removeEventListener(
      WidgetEventTypes.Resize,
      this._resizeHandler.bind(this)
    );
    (<ScrollViewBase>this).parentNode.nativeViewProtected.addEventListener(
      WidgetEventTypes.Resize,
      this._resizeHandler.bind(this)
    );

    this._resizeHandler();

    return true;
  }

  _removeViewFromNativeVisualTree(view: ViewBase): void {
    (<ScrollViewBase>this).parentNode.nativeViewProtected.removeEventListener(
      WidgetEventTypes.Resize,
      this._resizeHandler.bind(this)
    );
  }

  public initNativeView(): void {
    super.initNativeView();
    // if (this._androidViewId < 0) {
    //     this._androidViewId = android.view.View.generateViewId();
    // }

    // this.nativeViewProtected.setId(this._androidViewId);
  }

  _resizeHandler() {
    super.eachChild((view): boolean => {
      const size = this.nativeViewProtected.size();

      (<View>(<unknown>view)).styles
        .set("min-width", size.width() - this._scrollBarSize)
        .set("min-height", size.height() - this._scrollBarSize)
        .apply();

      return true;
    });
  }

  public _onOrientationChanged() {
    if (this.nativeViewProtected) {
      const parent = (<ViewCommon>this).parent;
      if (parent) {
        parent._removeView(this);
        parent._addView(this);
      }
    }
  }

  protected attachNative() {
    // const that = new WeakRef(this);
    // this.handler = new android.view.ViewTreeObserver.OnScrollChangedListener({
    //     onScrollChanged: function () {
    //         const owner: ScrollView = that.get();
    //         if (owner) {
    //             owner._onScrollChanged();
    //         }
    //     }
    // });
    //
    // this.nativeViewProtected.getViewTreeObserver().addOnScrollChangedListener(this.handler);
  }

  private _lastScrollX: number = -1;
  private _lastScrollY: number = -1;
  private _onScrollChanged() {
    const nativeView = this.nativeViewProtected;
    if (nativeView) {
      // Event is only raised if the scroll values differ from the last time in order to wokraround a native Android bug.
      // https://github.com/NativeScript/NativeScript/issues/2362
      // let newScrollX = nativeView.getScrollX();
      // let newScrollY = nativeView.getScrollY();
      // if (newScrollX !== this._lastScrollX || newScrollY !== this._lastScrollY) {
      //     this.notify(<ScrollEventData>{
      //         object: this,
      //         eventName: ScrollView.scrollEvent,
      //         scrollX: newScrollX / layout.getDisplayDensity(),
      //         scrollY: newScrollY / layout.getDisplayDensity()
      //     });
      //     this._lastScrollX = newScrollX;
      //     this._lastScrollY = newScrollY;
      // }
    }
  }

  protected dettachNative() {
    // this.nativeViewProtected.getViewTreeObserver().removeOnScrollChangedListener(this.handler);
    // this.handler = null;
  }
}
