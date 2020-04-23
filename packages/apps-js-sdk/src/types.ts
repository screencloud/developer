export interface Theme {
  primaryColor: { [key: string]: string };
  textOnPrimary: { [key: string]: string };
  textOnSecondary: { [key: string]: string };
  secondaryColor: { [key: string]: string };
  headingFont?: Font;
  bodyFont?: Font;
  id: string;
  name: string;
}

interface Font {
  family: string;
  url: string;
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
  context: {
    theme?: Theme;
    screenData?: ScreenData;
    userInteractionEnabled: boolean; // If true, user is in an environment where they have some control, e.g. using a mouse on the embedded player.
  };
  orgId: string;
  spaceId: string;
  screenId?: string; // Empty if not running on a screen, e.g. in preview mode.
}
