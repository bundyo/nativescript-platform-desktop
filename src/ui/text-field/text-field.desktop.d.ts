import { TextFieldBase } from "@nativescript/core/ui/text-field/text-field-common";
export * from "@nativescript/core/ui/text-field/text-field-common";
export declare class TextField extends TextFieldBase {
    _configureEditText(editText: any): void;
    _onReturnPress(): void;
    setSecureAndKeyboardType(): void;
}
