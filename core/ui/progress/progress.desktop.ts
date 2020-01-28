import {
    ProgressBase, Color, valueProperty, maxValueProperty,
    backgroundInternalProperty, Style, CssProperty, makeParser, makeValidator, InheritedCssProperty
} from "@nativescript/core/ui/progress/progress-common";
import { QProgressBar } from "@nodegui/nodegui";
import { StyleList, View } from "../core/view/view.desktop";
import { uniqId } from "../../utils/utils.desktop";
import { TextAlignment } from "@nativescript/core/ui/text-base";

export * from "@nativescript/core/ui/progress/progress-common";

export const desktopChunkColorProperty = new CssProperty<Style, Color>({
    name: "desktopChunkColor",
    cssName: "desktop-chunk-color",
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v)
});
desktopChunkColorProperty.register(Style);

export const desktopChunkMarginProperty = new CssProperty<Style, number>({
    name: "desktopChunkMargin",
    cssName: "desktop-chunk-margin"
});
desktopChunkMarginProperty.register(Style);

export const desktopChunkWidthProperty = new CssProperty<Style, number>({
    name: "desktopChunkWidth",
    cssName: "desktop-chunk-width"
});
desktopChunkWidthProperty.register(Style);

const textAlignmentConverter = makeParser<TextAlignment>(makeValidator<TextAlignment>("initial", "left", "center", "right"));
export const textAlignmentProperty = new InheritedCssProperty<Style, TextAlignment>({ name: "textAlignment", cssName: "text-align", defaultValue: "initial", valueConverter: textAlignmentConverter });
textAlignmentProperty.register(Style);

export class Progress extends ProgressBase {
    nativeViewProtected: QProgressBar;
    styles: StyleList = new StyleList(<View><unknown>this, "QProgressBar", ["chunk"]);

    createNativeView() {
        const view = new QProgressBar();
        view.setObjectName(uniqId());

        return view;
    }

    get desktop() {
        return this.nativeViewProtected;
    }

    [valueProperty.getDefault](): number {
        return 0;
    }
    [valueProperty.setNative](value: number) {
        this.desktop.setValue(value);
    }

    [maxValueProperty.getDefault](): number {
        return 100;
    }
    [maxValueProperty.setNative](value: number) {
        this.desktop.setMaximum(value);
    }

    [desktopChunkColorProperty.setNative](value: Color) {
        this.styles
            .set("background-color", value instanceof Color ? value.desktop : value, "chunk")
            .apply();
    }

    [desktopChunkMarginProperty.setNative](value: number) {
        this.styles
            .set("margin", value, "chunk")
            .apply();
    }

    [desktopChunkWidthProperty.setNative](value: Color) {
        this.styles
            .set("width", value, "chunk")
            .apply();
    }

    [textAlignmentProperty.setNative](value: string) {
        this.styles
            .set("text-align", value)
            .apply();
    }

    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value: Color) {
        //
    }
}
