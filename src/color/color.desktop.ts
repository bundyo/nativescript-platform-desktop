import * as common from "@nativescript/core/color/color-common";

export class Color extends common.Color {
  get desktop(): string {
    return super.hex;
  }
}
