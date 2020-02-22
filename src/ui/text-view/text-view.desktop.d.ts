import { EditableTextBase } from "@nativescript/core/ui/editable-text-base/editable-text-base";
import { TextView as TextViewDefinition } from "@nativescript/core/ui/text-view";
export * from "@nativescript/core/ui/text-base/text-base";
export declare class TextView extends EditableTextBase implements TextViewDefinition {
    maxLines: number;
    _configureEditText(editText: any): void;
    resetNativeView(): void;
}
