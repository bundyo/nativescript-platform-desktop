import { Frame } from "@nativescript/core/ui/frame";

export class ButtonsModel {
  goBack() {
    Frame.topmost().goBack();
  }
}

export function navigatingTo({ object: page }) {
  page.bindingContext = new ButtonsModel();
}
