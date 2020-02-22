import { StackLayoutBase } from "@nativescript/core/ui/layouts/stack-layout/stack-layout-common";
import { QWidget } from "@nodegui/nodegui";
import { StyleList } from "../../core/view/view.desktop";
export * from "@nativescript/core/ui/layouts/stack-layout/stack-layout-common";
export declare class StackLayout extends StackLayoutBase {
    nativeViewProtected: QWidget;
    styles: StyleList;
    createNativeView(): QWidget;
    initNativeView(): void;
}
