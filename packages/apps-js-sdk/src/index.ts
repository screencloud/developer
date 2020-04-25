import {
  CONNECT_SUCCESS,
  INITIALIZE,
  LOG_PREFIX,
  SAMPLE_INITIALIZE_PAYLOAD,
} from "./constants";
import {
  connectMessage,
  initializedMessage,
  InitializeMessage,
  PlayerMessage,
} from "./messages";
import { AppConfig, InitializeMessagePayload } from "./types";
import { mergeInitializePayloads } from "./utils/objectUtils";
import { parseMessage, sendMessage } from "./utils/postMessage";

let sc: ScreenCloud;

/**
 * The main interface between your app and the Player running it.
 *
 * Use this to interact with the app lifecycle, and get details about
 * the user like their config and theme settings.
 *
 * See https://screencloud.github.io/developer/ for full descriptions.
 *
 * You should always use the methods available here, rather than going
 * directly to the Player (where the API could change at any time).
 */
class ScreenCloud<TAppConfig = AppConfig> {
  private parentOrigin = ""; // What URL should postMessages be sent to?
  private resolveInitialize?: (value?: InitializeMessagePayload) => void;
  private rejectInitialize?: (reason?: any) => void; // Not used yet. In theory, could time out after x. Otherwise any issue here likely means a Player problem.
  private initializePayload?: InitializeMessagePayload;

  constructor() {
    window.addEventListener("message", this.onMessage, false);
    sendMessage(connectMessage());
  }

  /**
   * Ensure we have the crucial Initialize payload before continuing.
   *
   * This is called automatically by startApp(), you do not ever need to call it manually.
   *
   * If testData given, then merge with a sample payload, then resolve Initialize manually below with that object.
   * If the real initialize then comes later, warn user that they have shipped their test data to a real player.
   */
  initialize = async (testData?: Partial<InitializeMessagePayload>) => {
    return new Promise<InitializeMessagePayload>((resolve, reject) => {
      this.resolveInitialize = resolve;
      this.rejectInitialize = reject;

      if (testData) {
        const payload = mergeInitializePayloads(
          SAMPLE_INITIALIZE_PAYLOAD,
          testData
        );

        this.resolveInitialize(payload);
      }
    });
  };

  // public getConfig = (): TAppConfig => {
  //   return this.initializePayload?.config;
  // }

  /**
   * PostMessage received. Parse it.
   */
  private onMessage = (event: MessageEvent) => {
    try {
      const message = parseMessage(event);
      console.log(LOG_PREFIX + "Received message", message);

      // Use the URL of the responding SUCCESS event as the target for future messages.
      if (message.type === CONNECT_SUCCESS) {
        this.parentOrigin = event.origin;
      }

      this.handleMessage(message);
    } catch (e) {
      console.log(LOG_PREFIX + e);
    }
  };

  /**
   * Handle messages sent from the parent.
   */
  private handleMessage = (message: PlayerMessage): void => {
    switch (message.type) {
      case CONNECT_SUCCESS:
        console.log(LOG_PREFIX + "Connected to parent player.");
        break;
      case INITIALIZE:
        this.handleInitialize(message);
        break;
    }
  };

  /**
   * Store data passed from the Player on startup.
   */
  private handleInitialize = (message: InitializeMessage): void => {
    if (this.initializePayload) {
      console.warn(
        LOG_PREFIX +
          "It looks like you've deployed with your testData included. This is likely a bug. Data and config from the player are being ignored."
      );
      return;
    }

    if (!this.resolveInitialize) {
      console.warn(
        LOG_PREFIX + "Error: Received init payload before we were ready for it."
      );
      return;
    }

    this.resolveInitialize(message.payload);
    console.log(LOG_PREFIX + "Initialized with data", message.payload);

    sendMessage(initializedMessage());
  };
}

// const getSc = <TAppConfig = AppConfig>(): ScreenCloud<TAppConfig> => {
//   if (!initializePayload) {
//     throw "Tried to get SC object before app was initialized.";
//   }

//   return {
//     appId: initializePayload.appId,
//     appStarted: false,
//     config: initializePayload.config as TAppConfig, // TODO - Can remove casting if switching to an object.
//     context: initializePayload.context,
//   };
// };

/**
 * Start the app.
 *
 * This will resolve with the `sc` object only when we've received the Initialize data,
 * i.e. when app is able to start loading.
 */
export const startApp = async <TAppConfig = AppConfig>(options?: {
  testData?: Partial<InitializeMessagePayload>; // PIn local development/testing, you can pass the data to initialize your app with. In particular; `testData.config`
}): Promise<ScreenCloud<TAppConfig>> => {
  sc = new ScreenCloud<TAppConfig>();
  await sc.initialize(options?.testData);
  return sc;
};

/**
 * Get the SC instance.
 */
export const getScreenCloud = <TAppConfig = AppConfig>(): ScreenCloud<
  TAppConfig
> => {
  if (!sc) {
    console.warn(
      LOG_PREFIX +
        "Tried to fetch the SC object before app was initialized. Call startApp() first (which will also return the SC object)."
    );
  }

  return sc;
};
