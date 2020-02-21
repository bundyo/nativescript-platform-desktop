import { orientationProperty, StackLayoutBase } from "@nativescript/core/ui/layouts/stack-layout/stack-layout-common";
import { FlexLayout, QWidget } from "@nodegui/nodegui";
import { uniqId } from "../../../utils/utils.desktop";
import { StyleList } from "../../core/view/view.desktop";

export * from "@nativescript/core/ui/layouts/stack-layout/stack-layout-common";

export class StackLayout extends StackLayoutBase {
  nativeViewProtected: QWidget;
  styles: StyleList = new StyleList(this);

  public createNativeView() {
    const view = new QWidget();
    view.setObjectName(uniqId());
    view.setLayout(new FlexLayout());

    return view;
  }

  initNativeView(): void {
    this.styles
      .set("flex-direction", "column")
      .set("height", "auto")
      .apply();
  }

  [orientationProperty.setNative](value: "horizontal" | "vertical") {
    this.styles
      .set("flex-direction", value === "vertical" ? "column" : "row")
      .apply();
  }
}
