import { EditableTextBase as EditableTextBaseCommon, FormattedString } from "@nativescript/core/ui/editable-text-base/editable-text-base-common";
export * from "@nativescript/core/ui/editable-text-base/editable-text-base-common";
export declare abstract class EditableTextBase extends EditableTextBaseCommon {
    nativeViewProtected: any;
    dismissSoftInput(): void;
}
export declare function _updateCharactersInRangeReplacementString(formattedText: FormattedString, rangeLocation: number, rangeLength: number, replacementString: string): void;
