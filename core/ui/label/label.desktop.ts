import { Label as LabelDefinition } from "@nativescript/core/ui/label";
import { TextBase, WhiteSpace, whiteSpaceProperty, booleanConverter, CSSType } from "@nativescript/core/ui/text-base";
import { profile } from "@nativescript/core/profiling";
import { QLabel } from "@nodegui/nodegui";
import {uniqId} from "../../utils/utils.desktop";

export * from "@nativescript/core/ui/text-base";

//let TextView: typeof android.widget.TextView;

@CSSType("Label")
export class Label extends TextBase implements LabelDefinition {
    nativeViewProtected: QLabel;

    get desktop(): QLabel {
        return this.nativeTextViewProtected;
    }

    get textWrap(): boolean {
        return this.style.whiteSpace === "normal";
    }
    set textWrap(value: boolean) {
        if (typeof value === "string") {
            value = booleanConverter(value);
        }

        this.style.whiteSpace = value ? "normal" : "nowrap";
    }

    @profile
    public createNativeView() {
        const label = new QLabel();
        label.setObjectName(uniqId());
        //label.setInlineStyle("background-color: red");

        return label; // new TextView(this._context);
    }

    public initNativeView(): void {
        super.initNativeView();
        const textView = this.nativeTextViewProtected;
        //textView.setSingleLine(true);
        // textView.setEllipsize(android.text.TextUtils.TruncateAt.END);
    }

    [whiteSpaceProperty.setNative](value: WhiteSpace) {
        // Label initial value is no-wrap. set in initNativeView
        const newValue = value === "initial" ? "nowrap" : value;
        super[whiteSpaceProperty.setNative](newValue);
    }
}
