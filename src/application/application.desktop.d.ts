export let desktop: DesktopApplication;

export interface DesktopApplication {
    /**
     * Gets or sets the orientation of the application.
     * Available values: "portrait", "landscape", "unknown".
     */
    orientation: "portrait" | "landscape" | "unknown";

    /**
     * Gets the system appearance.
     * Available values: "dark", "light", null.
     * Null for iOS <= 11.
     */
    systemAppearance: "dark" | "light" | null;

    /**
     * The [UIApplication](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html).
     */
    nativeApp: any /* UIApplication */;
}
