import {
    PageBase,
    Color,
    actionBarHiddenProperty,
    statusBarStyleProperty,
    ViewBase
} from "@nativescript/core/ui/page/page-common";
import {ActionBar} from "@nativescript/core/ui/action-bar";
import {StyleList, View} from "../core/view/view.desktop"
// @ts-ignore
import {FlexLayout, QWidget, WidgetEventTypes} from "@nodegui/nodegui";
import { device } from "@nativescript/core/platform";
import { profile } from "@nativescript/core/profiling";
import { uniqId } from "../../utils/utils.desktop";

export * from "@nativescript/core/ui/page/page-common";

const SYSTEM_UI_FLAG_LIGHT_STATUS_BAR = 0x00002000;
const STATUS_BAR_LIGHT_BCKG = -657931;
const STATUS_BAR_DARK_BCKG = 1711276032;

export class Page extends PageBase {
    public nativeViewProtected: QWidget;
    // public styles: StyleList = new StyleList(this);
    private _actionBarView: View;
    private _contentView: View;
    private _actionBarWidget: QWidget;
    private _contentWidget: QWidget;

    public createNativeView() {
        const view = new QWidget();
        view.setObjectName(uniqId());
        view.setLayout(new FlexLayout());

        this._actionBarWidget = new QWidget;
        this._actionBarWidget.setObjectName(uniqId());
        this._actionBarWidget.setLayout(new FlexLayout());

        this._contentWidget = new QWidget;
        this._contentWidget.setObjectName(uniqId());
        this._contentWidget.setLayout(new FlexLayout());

        view.layout.addWidget(this._actionBarWidget);
        view.layout.addWidget(this._contentWidget);

        return view;
    }

    public initNativeView(): void {
        super.initNativeView();

        (<View><unknown>this).styles
            .set("flex-direction", "column")
            .apply();
    }

    public _addViewToNativeVisualTree(view: View, atIndex?: number): boolean {
        if (this.nativeViewProtected && view.nativeViewProtected) {
            if (view instanceof ActionBar) {
                this._actionBarView = view;
                this._actionBarWidget.layout.addWidget(view.nativeViewProtected);
            } else {
                this._contentView = view;
                this._contentWidget.layout.addWidget(view.nativeViewProtected);

                (<View>view).styles
                    .set("flex", "1")
            }

            (<View>view).styles.apply();
        }

        this.nativeViewProtected.removeEventListener(WidgetEventTypes.Resize, this._resizeHandler.bind(this));
        this.nativeViewProtected.addEventListener(WidgetEventTypes.Resize, this._resizeHandler.bind(this));

        return true;
    }

    _resizeHandler() {
        super.eachChild((view): boolean => {
            const size = this.nativeViewProtected.size();

            this._actionBarWidget.setInlineStyle(`max-height: 60; width: ${size.width()}`);
            this._contentWidget.setInlineStyle(`width: ${size.width()}; height: ${size.height() - 60}`);

            this._actionBarWidget.layout.update();
            this._contentWidget.layout.update();

            return true;
        });
    }

    _removeViewFromNativeVisualTree(view: ViewBase): void {
        this.nativeViewProtected.removeEventListener(WidgetEventTypes.Resize, this._resizeHandler.bind(this));
    }

    @profile
    public onLoaded() {
        super.onLoaded();
        if (super.actionBarHidden !== undefined) {
            this.updateActionBar();
        }
    }

    private updateActionBar() {
        super.actionBar.update();
    }

    [actionBarHiddenProperty.setNative](value: boolean) {
        this.updateActionBar();
    }

    [statusBarStyleProperty.getDefault](): { color: number, systemUiVisibility: number } {
        // if (device.sdkVersion >= "21") {
        //     const window = (<androidx.appcompat.app.AppCompatActivity>this._context).getWindow();
        //     const decorView = window.getDecorView();
        //
        //     return {
        //         color: (<any>window).getStatusBarColor(),
        //         systemUiVisibility: decorView.getSystemUiVisibility()
        //     };
        // }

        return null;
    }

    [statusBarStyleProperty.setNative](value: "dark" | "light" | { color: number, systemUiVisibility: number }) {
        if (device.sdkVersion >= "21") {
            //const window = (<androidx.appcompat.app.AppCompatActivity>this._context).getWindow();
            //const decorView = window.getDecorView();

            // if (value === "light") {
            //     (<any>window).setStatusBarColor(STATUS_BAR_LIGHT_BCKG);
            //     decorView.setSystemUiVisibility(SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            //
            // } else if (value === "dark") {
            //     (<any>window).setStatusBarColor(STATUS_BAR_DARK_BCKG);
            //     decorView.setSystemUiVisibility(0);
            // } else {
            //     (<any>window).setStatusBarColor(value.color);
            //     decorView.setSystemUiVisibility(value.systemUiVisibility);
            // }
        }
    }
}
