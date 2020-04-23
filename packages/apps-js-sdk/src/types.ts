export interface ScreenCloud {
  appStarted: boolean; // Is the app visible? (i.e. not preloading)
  context: AppContext;
  appId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: { [prop: string]: any };
  //   emitFinished: Function;
  //   emitPreloaded: Function;
  //   emitConfigUpdateAvailable: Function;
  //   onRequestConfigUpdate: Function;
  //   UNSAFE_onStart: Function;
  //   requestFile: Function;
  //   requestFiles: Function;
}

interface ThemeColor {
  "100": string; // Lightest variation of this color.
  "200": string; // Lighter variation of this color.
  "300": string; // Lighter variation of this color.
  "400": string; // Lighter variation of this color.
  "500": string; // The "default" color, as selected by the user in the Themes panel.
  "600": string; // Darker variation of this color.
  "700": string; // Darker variation of this color.
  "800": string; // Darker variation of this color.
  "900": string; // Darkest variation of this color.
}

interface ThemeFont {
  family: string;
  url: string;
}

export interface Theme {
  primaryColor: ThemeColor;
  textOnPrimary: ThemeColor;
  textOnSecondary: ThemeColor;
  secondaryColor: ThemeColor;
  headingFont?: ThemeFont;
  bodyFont?: ThemeFont;
  id: string;
  name: string;
}

/**
 * The config for this specific instance.
 * This is set by users of your app inside Studio.
 */
export interface AppConfig {
  [
    key: string
  ]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}

export interface AppContext {
  theme?: Theme;
  screenData?: ScreenData;
  userInteractionEnabled: boolean; // If true, user is in an environment where they have some control, e.g. using a mouse on the embedded player.
}

/**
 * Key:value pairs of strings that can be attached to any screen in Studio.
 * This lets your apps read screen-specific data and work differently as needed.
 * e.g. "storeId": "123"
 */
export interface ScreenData {
  [key: string]: string;
}

export interface InitializeMessagePayload {
  appId: string;
  appInstanceId: string;
  config: AppConfig;
  context: AppContext;
  orgId: string;
  spaceId: string;
  screenId?: string; // Empty if not running on a screen, e.g. in preview mode.
}
