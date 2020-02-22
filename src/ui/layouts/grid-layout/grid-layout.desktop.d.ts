import { GridLayoutBase, ItemSpec as ItemSpecBase } from "@nativescript/core/ui/layouts/grid-layout/grid-layout-common";
import { QWidget } from "@nodegui/nodegui";
export * from "@nativescript/core/ui/layouts/grid-layout/grid-layout-common";
export declare class ItemSpec extends ItemSpecBase {
    nativeSpec: any;
    get actualLength(): number;
}
export declare class GridLayout extends GridLayoutBase {
    nativeViewProtected: QWidget;
    createNativeView(): QWidget;
    initNativeView(): void;
    resetNativeView(): void;
    protected invalidate(): void;
}
