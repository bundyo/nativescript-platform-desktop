import { CSSType, EditableTextBase } from "@nativescript/core/ui/editable-text-base/editable-text-base";
import { TextView as TextViewDefinition } from "@nativescript/core/ui/text-view";

export * from "@nativescript/core/ui/text-base/text-base";

@CSSType("TextView")
export class TextView extends EditableTextBase implements TextViewDefinition {
  public _configureEditText(editText: any) {
    // editText.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
    // editText.setGravity(android.view.Gravity.TOP | android.view.Gravity.START);
  }

  public resetNativeView(): void {
    super.resetNativeView();
    // this.nativeTextViewProtected.setGravity(android.view.Gravity.TOP | android.view.Gravity.START);
  }
}
