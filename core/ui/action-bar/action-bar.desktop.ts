import {
    ActionBarBase,
    ActionItemBase,
    backgroundColorProperty,
    backgroundInternalProperty,
    Color,
    colorProperty,
    flatProperty,
    isVisible,
    layout
} from "@nativescript/core/ui/action-bar/action-bar-common";
import { desktop as desktopUtils, uniqId } from "../../utils/utils.desktop";
import { FlexLayout, QLabel, QWidget, WidgetEventTypes } from "@nodegui/nodegui";
import { StyleList, View, ViewCommon } from "../core/view/view.desktop";
import {ViewBase} from "@nativescript/core";

export * from "@nativescript/core/ui/action-bar/action-bar-common";

const majorVersion = desktopUtils.MajorVersion;
const UNSPECIFIED = layout.makeMeasureSpec(0, layout.UNSPECIFIED);

// function loadActionIcon(item: ActionItemDefinition): any /* UIImage */ {
//     let is = null;
//     let img = null;
//
//     const itemIcon = item.icon;
//     const itemStyle = item.style;
//     if (isFontIconURI(itemIcon)) {
//         const fontIconCode = itemIcon.split("//")[1];
//         const font = itemStyle.fontInternal;
//         const color = itemStyle.color;
//         is = ImageSource.fromFontIconCodeSync(fontIconCode, font, color);
//     } else {
//         is = ImageSource.fromFileOrResourceSync(itemIcon);
//     }
//
//     if (is && is.ios) {
//         img = is.ios;
//     } else {
//         traceMissingIcon(itemIcon);
//     }
//
//     return img;
// }

const menuItemClickListener: any = function onClick(v) {
    if (v) {
        v._emit(ActionItemBase.tapEvent);
    }
};

export class ActionItem extends ActionItemBase {
    private _desktop: Object = {
        position: "right",
        systemIcon: undefined
    };
    private _label: QLabel;
    public styles: StyleList = new StyleList(this);
    public nativeViewProtected: QWidget;

    public createNativeView() {
        const view = new QWidget();
        view.setObjectName(uniqId());
        view.setLayout(new FlexLayout());

        return view;
    }

    public initNativeView(): void {
        super.initNativeView();
        const view = this.nativeViewProtected;
        view.addEventListener(WidgetEventTypes.MouseButtonPress, menuItemClickListener.bind(this, this));
        (<any>view).menuItemClickListener = menuItemClickListener;

        this._label = new QLabel();
        view.layout.addWidget(this._label);
    }

    public _addViewToNativeVisualTree(child: View): boolean {
        super._addViewToNativeVisualTree(child);

        this.styles
            .set("align-items", "center")
            .set("justify-content", "space-around")
            .apply();

        if (this.nativeViewProtected && child.nativeViewProtected) {
            (<FlexLayout>this.nativeViewProtected.layout).removeWidget(this._label);
            this.nativeViewProtected.layout.addWidget(child.nativeViewProtected);

            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        super._removeViewFromNativeVisualTree(child);

        if (child.nativeViewProtected) {
            (<FlexLayout>this.nativeViewProtected.layout).removeWidget(child.nativeViewProtected);
        }
    }

    public disposeNativeView() {
        (<any>this.nativeViewProtected).menuItemClickListener = null;
        super.disposeNativeView();
    }

    set text(value) {
        if (this._label) {
            this._label.setText(value);
        }
    }

    public get desktop(): Object {
        return this._desktop;
    }
    public set desktop(value: Object) {
        throw new Error("ActionItem.settings is read-only");
    }
}

export class NavigationButton extends ActionItem {
    _navigationItem: any;

    public _onVisibilityChanged(visibility: string): void {
        if (this._navigationItem) {
            const visible: boolean = visibility === "visible";
            this._navigationItem.setHidesBackButtonAnimated(!visible, true);
        }
    }
}

export class ActionBar extends ActionBarBase {
    nativeViewProtected: QWidget;
    public styles: StyleList;
    private _titleWidget: QWidget;
    private _leftWidget: QWidget;
    private _rightWidget: QWidget;

    get desktop(): QWidget {
        const page = super.page;
        if (!page || !page.parent) {
            return;
        }

        return this.nativeViewProtected;
    }

    public createNativeView(): QWidget {
        const view = new QWidget();
        view.setObjectName(uniqId());
        view.setLayout(new FlexLayout());

        this._leftWidget = new QWidget();
        this._leftWidget.setObjectName(uniqId());
        this._leftWidget.setLayout(new FlexLayout());
        this._leftWidget.setInlineStyle("background-color: red; flex-direction: row; flex: 1; align-items: center; justify-content: flex-start;");

        view.layout.addWidget(this._leftWidget);

        this._titleWidget = new QWidget();
        this._titleWidget.setObjectName(uniqId());
        this._titleWidget.setLayout(new FlexLayout());
        this._titleWidget.setInlineStyle("background-color: orange; flex: 0; align-items: center; justify-content: center;");

        view.layout.addWidget(this._titleWidget);

        this._rightWidget = new QWidget();
        this._rightWidget.setObjectName(uniqId());
        this._rightWidget.setLayout(new FlexLayout());
        this._rightWidget.setInlineStyle("background-color: red; flex-direction: row; flex: 1; align-items: center; justify-content: flex-end;");

        view.layout.addWidget(this._rightWidget);

        return view;
    }

    initNativeView() {
        this.update();

        this.styles
            .set("flex", 1)
            .set("height", "60")
            .apply();
    }

    public _addChildFromBuilder(name: string, value: any) {
        if (value instanceof NavigationButton) {
            (<ActionBarBase>this).navigationButton = value;
        } else if (value instanceof ActionItem) {
            (<ActionBarBase>this).actionItems.addItem(value);
        } else if (value instanceof View) {
            (<ActionBarBase>this).titleView = value;
        }
    }

    public get _getActualSize(): any {
        const page = super.page;
        // Page should be attached to frame to update the action bar.
        if (!page || !page.frame) {
            return;
        }
        if (!page) {
            return { width: 0, height: 0 };
        }

        // const frame = navBar.frame;
        // const size = frame.size;
        // const width = layout.toDevicePixels(size.width);
        // const height = layout.toDevicePixels(size.height);

        return { width: "100%", height: 100 };
    }

    public layoutInternal(): void {
        const { width, height } = this._getActualSize;
        const widthSpec = layout.makeMeasureSpec(width, layout.EXACTLY);
        const heightSpec = layout.makeMeasureSpec(height, layout.EXACTLY);

        (<View><unknown>this).measure(widthSpec, heightSpec);
        (<ViewCommon><unknown>this).layout(0, 0, width, height, false);
    }

    public _updateTitleAndTitleView() {
        if (!(<ActionBarBase>this).titleView) {
            // No title view - show the title
            let title = (<ActionBarBase>this).title;
            if (title !== undefined) {
                if (this.desktop) {
                    this.desktop.setWindowTitle(title);
                }

                const label = new QLabel();
                label.setText(title);
                this._titleWidget.layout.addWidget(label);
            }
        }
    }

    public update() {
        const page = super.page;
        // Page should be attached to frame to update the action bar.
        if (!page || !page.frame) {
            return;
        }


        // Add menu items
        this._addActionItems();

        // Set title
        this._updateTitleAndTitleView();

        // Set home icon
        this._updateIcon();

        // Set navigation button
        this._updateNavigationButton();

    }

    public _updateNavigationButton() {
        const navButton = (<ActionBarBase>this).navigationButton;
        if (navButton && isVisible(navButton)) {
            const systemIcon = navButton["desktop"].systemIcon;

            // Set navigation content descripion, used by screen readers for the vision-impaired users
            // this.nativeViewProtected.text = navButton.text || null;

            let navBtn = new WeakRef(navButton);
            this.nativeViewProtected.addEventListener(WidgetEventTypes.MouseButtonPress, function (v) {
                let owner = navBtn.get();
                if (owner) {
                    owner._raiseTap();
                }
            });
        }
        else {
            //this.nativeViewProtected.setNavigationIcon(null);
        }
    }

    public _updateIcon() {
        //this.nativeViewProtected.icon = this.desktop.icon;
        // let visibility = getIconVisibility(this.android.iconVisibility);
        // if (visibility) {
        //     let icon = this.web.icon;
        //     if (icon !== undefined) {
        //         let drawableOrId = getDrawableOrResourceId(icon, appResources);
        //         if (drawableOrId) {
        //             this.nativeViewProtected.setLogo(drawableOrId);
        //         }
        //     }
        //     else {
        //         let defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
        //         this.nativeViewProtected.setLogo(defaultIcon);
        //     }
        // }
        // else {
        //     this.nativeViewProtected.setLogo(null);
        // }
    }

    public _addActionItems() {
        let items = (<ActionBarBase>this).actionItems.getVisibleItems();

        for (let i = 0; i < items.length; i++) {
            let item = <ActionItem>items[i];

            // if (item.icon) {
            //     //item.nativeViewProtected["icon"] = item.icon;
            // }

            if (item.desktop["position"] === "left") {
                //item.nativeViewProtected["position"] = item.desktop["position"];
            }

            if (item.nativeViewProtected) {
                const layout = this[`_${item.desktop["position"]}Widget`].layout;

                layout.removeWidget(item.nativeViewProtected);
                layout.addWidget(item.nativeViewProtected);
            }
        }
    }

    public _onTitlePropertyChanged() {
        if (this.nativeViewProtected) {
            this._updateTitleAndTitleView();
        }
    }

    public _onIconPropertyChanged() {
        if (this.nativeViewProtected) {
            this._updateIcon();
        }
    }

    public _addViewToNativeVisualTree(child: View, atIndex: number = Number.MAX_VALUE): boolean {
        super._addViewToNativeVisualTree(child);

        if (this.nativeViewProtected && child.nativeViewProtected) {
            const layout = this[`_${child.desktop["position"]}Widget`].layout;

            layout.removeWidget(child.nativeViewProtected);
            layout.addWidget(child.nativeViewProtected);

            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        super._removeViewFromNativeVisualTree(child);

        if (child.nativeViewProtected) {
            this[`_${child.desktop["position"]}Widget`].layout.removeWidget(child.nativeViewProtected);
        }
    }

    // getTitle() {
    //     return this.nativeViewProtected.querySelector(".ns-action-bar__title");
    // }

    private updateColors(navBar: QWidget) {
        const color = (<ActionBarBase>this).color;
        const bgColor = <Color>(<ActionBarBase>this).backgroundColor;

        this.styles
            .set("color", color)
            .set("background-color", bgColor)
            .apply();
    }

    private setColor(navBar: QWidget, color?: Color) {
        if (color) {
            this.styles.set("color", color.desktop).apply();
        } else {
            this.styles.set("color", "default").apply();
        }
    }

    private updateFlatness(navBar) {
        if ((<ActionBarBase>this).flat) {
            // navBar.setBackgroundImageForBarMetrics(UIImage.new(), UIBarMetrics.Default);
            // navBar.shadowImage = UIImage.new();
            navBar.translucent = false;
        } else {
            navBar.setBackgroundImageForBarMetrics(null, null);
            navBar.shadowImage = null;
            navBar.translucent = true;
        }
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        // const width = layout.getMeasureSpecSize(widthMeasureSpec);
        // const height = layout.getMeasureSpecSize(heightMeasureSpec);
        //
        // if (this.titleView) {
        //     View.measureChild(this, this.titleView, UNSPECIFIED, UNSPECIFIED);
        // }
        //
        // this.actionItems.getItems().forEach((actionItem) => {
        //     const actionView = actionItem.actionView;
        //     if (actionView) {
        //         View.measureChild(this, actionView, UNSPECIFIED, UNSPECIFIED);
        //     }
        // });
        //
        // // We ignore our width/height, minWidth/minHeight dimensions because it is against Apple policy to change height of NavigationBar.
        // this.setMeasuredDimension(width, height);
    }

    public onLayout(left: number, top: number, right: number, bottom: number) {
        const titleView = (<ActionBarBase>this).titleView;
        if (titleView) {
            if (majorVersion > 10) {
                // On iOS 11 titleView is wrapped in another view that is centered with constraints.
                ViewCommon.layoutChild(<View><unknown>this, titleView, 0, 0, titleView.getMeasuredWidth(), titleView.getMeasuredHeight());
            } else {
                // On iOS <11 titleView is direct child of UINavigationBar so we give it full width and leave
                // the layout to center it.
                ViewCommon.layoutChild(<View><unknown>this, titleView, 0, 0, right - left, bottom - top);
            }
        }

        (<ActionBarBase>this).actionItems.getItems().forEach((actionItem) => {
            const actionView = actionItem.actionView;
            if (actionView && actionView.ios) {
                const measuredWidth = actionView.getMeasuredWidth();
                const measuredHeight = actionView.getMeasuredHeight();
                ViewCommon.layoutChild(<View><unknown>this, actionView, 0, 0, measuredWidth, measuredHeight);
            }
        });

        super.onLayout(left, top, right, bottom);
    }

    public layoutNativeView(left: number, top: number, right: number, bottom: number) {
        return;
    }

    private get navBar(): any {
        const page = super.page;
        // Page should be attached to frame to update the action bar.
        if (!page || !page.frame) {
            return undefined;
        }

        // return (<UINavigationController>page.frame.ios.controller).navigationBar;
    }

    [colorProperty.getDefault](): any {
        return this.styles.get("color");
    }
    [colorProperty.setNative](value: Color) {
        let color = value instanceof Color ? value.desktop : value;
        this.styles.set("color", color).apply();
    }

    [backgroundColorProperty.getDefault](): any {
        // This getter is never called.
        // CssAnimationProperty use default value form their constructor.
        return this.styles.get("background-color");
    }
    [backgroundColorProperty.setNative](value: Color) {
        if (this.desktop) {
            let color = value instanceof Color ? value.desktop : value;
            this.styles.set("background-color", color).apply();
        }
    }

    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) { // tslint:disable-line
    }

    [flatProperty.setNative](value: boolean) { // tslint:disable-line
        const navBar = this.navBar;
        if (navBar) {
            this.updateFlatness(navBar);
        }
    }
}
