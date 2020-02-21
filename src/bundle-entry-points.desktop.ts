if (global.TNS_WEBPACK) {
  require("@nativescript/core/globals");
  require("@nativescript/core/utils/utils");

  // Register "dynamically" loaded module that need to be resolved by the
  // XML/component builders.

  global.registerModule("text/formatted-string", () =>
    require("@nativescript/core/text/formatted-string")
  );
  global.registerModule("text/span", () =>
    require("@nativescript/core/text/span")
  );
  global.registerModule("ui/text-base/formatted-string", () =>
    require("@nativescript/core/ui/text-base/formatted-string")
  );
  global.registerModule("ui/text-base/span", () =>
    require("@nativescript/core/ui/text-base/span")
  );
  global.registerModule("ui/action-bar", () =>
    require("@nativescript/core/ui/action-bar")
  );
  global.registerModule("ui/button", () =>
    require("@nativescript/core/ui/button")
  );
  global.registerModule("ui/content-view", () =>
    require("@nativescript/core/ui/content-view")
  );
  global.registerModule("ui/frame", () =>
    require("@nativescript/core/ui/frame")
  );
  global.registerModule("ui/label", () =>
    require("@nativescript/core/ui/label")
  );
  global.registerModule("ui/layouts/grid-layout", () =>
    require("@nativescript/core/ui/layouts/grid-layout")
  );
  global.registerModule("ui/layouts/stack-layout", () =>
    require("@nativescript/core/ui/layouts/stack-layout")
  );
  global.registerModule("ui/page", () => require("@nativescript/core/ui/page"));
  global.registerModule("ui/progress", () =>
    require("@nativescript/core/ui/progress")
  );
  global.registerModule("ui/repeater", () =>
    require("@nativescript/core/ui/repeater")
  );
  global.registerModule("ui/scroll-view", () =>
    require("@nativescript/core/ui/scroll-view")
  );
  global.registerModule("ui/text-field", () =>
    require("@nativescript/core/ui/text-field")
  );
  global.registerModule("ui/text-view", () =>
    require("@nativescript/core/ui/text-view")
  );
}
