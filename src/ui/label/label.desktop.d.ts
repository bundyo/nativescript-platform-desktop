import { Label as LabelDefinition } from "@nativescript/core/ui/label";
import { TextBase } from "@nativescript/core/ui/text-base";
import { QLabel } from "@nodegui/nodegui";
export * from "@nativescript/core/ui/text-base";
export declare class Label extends TextBase implements LabelDefinition {
    nativeViewProtected: QLabel;
    get desktop(): QLabel;
    get textWrap(): boolean;
    set textWrap(value: boolean);
    createNativeView(): QLabel;
    initNativeView(): void;
}
