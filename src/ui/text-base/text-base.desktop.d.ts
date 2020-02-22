import { TextTransform } from "@nativescript/core/ui/text-base/text-base";
import { FormattedString, Span, TextBaseCommon } from "@nativescript/core/ui/text-base/text-base-common";
import { QLabel, QPushButton } from "@nodegui/nodegui";
export * from "@nativescript/core/ui/text-base/text-base-common";
export declare class TextBase extends TextBaseCommon {
    nativeViewProtected: QPushButton | QLabel;
    nativeTextViewProtected: QPushButton | QLabel;
    _setNativeText(reset?: boolean): void;
    setFormattedTextDecorationAndTransform(): void;
    setTextDecorationAndTransform(): void;
    createNSMutableAttributedString(formattedString: FormattedString): any;
    createMutableStringForSpan(span: Span, text: string): any;
}
export declare function getTransformedText(text: string, textTransform: TextTransform): string;
