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
  initializeMessage,
  PlayerMessage,
} from "./messages";
import { AppConfig, InitializeMessagePayload } from "./types";
import { mergeInitializePayloads } from "./utils/objectUtils";
import { parseMessage, sendMessage } from "./utils/postMessage";

let sc: any; // Type will depend on user's given runtime config type, so need to store this reference as any.

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
class ScreenCloud<TConfig = AppConfig> {
  private parentOrigin = ""; // What URL should postMessages be sent to?
  private resolveInitialize?: (
    value?: InitializeMessagePayload<TConfig>
  ) => void;
  private rejectInitialize?: (reason?: any) => void; // Not used yet. In theory, could time out after x. Otherwise any issue here likely means a Player problem.
  private initializePayload?: InitializeMessagePayload<TConfig>;

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
  connect = async (testData?: Partial<InitializeMessagePayload<TConfig>>) => {
    return new Promise<InitializeMessagePayload<TConfig>>((resolve, reject) => {
      this.resolveInitialize = resolve;
      this.rejectInitialize = reject;

      if (testData) {
        this.initialize(testData);
      }
    });
  };

  /**
   * To develop and test your app outside of a Player, you can manually
   * call this method with the data the Player would normally provide.
   *
   * Just call the connect() method as normal, then `sc.initialize(yourData)`
   * afterwards.
   *
   * Be careful not to call this in production however, as it will overrule
   * any data later received from the real player.
   */
  initialize = (payload?: Partial<InitializeMessagePayload<TConfig>>) => {
    if (!this.resolveInitialize) {
      console.warn(
        LOG_PREFIX +
          "Error: You must call connect() to connect to the player, before you initialize() with test data."
      );
      return;
    }
    const combinedPayload = mergeInitializePayloads<TConfig>(
      // Casting as sample config can't know the user's config type ahead of time
      SAMPLE_INITIALIZE_PAYLOAD as InitializeMessagePayload<TConfig>,
      payload || {}
    );

    this.handleInitialize(initializeMessage(combinedPayload));
  };

  /**
   * Get the data provided by a user in the app settings pages.
   */
  public getConfig = (): TConfig => {
    if (!this.initializePayload) {
      const err =
        "Error: Tried to getConfig() before the app was initialized. Check that you waited for connectScreenCloud() to resolve before starting your app.";
      console.warn(LOG_PREFIX + err);
      throw err;
    }
    return this.initializePayload?.config;
  };

  /**
   * PostMessage received. Parse it.
   */
  private onMessage = (event: MessageEvent) => {
    try {
      const message = parseMessage<TConfig>(event);
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
  private handleMessage = (message: PlayerMessage<TConfig>): void => {
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
  private handleInitialize = (message: InitializeMessage<TConfig>): void => {
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

    this.initializePayload = message.payload;
    sendMessage(initializedMessage());
    console.log(LOG_PREFIX + "Initialized with data", message.payload);
    this.resolveInitialize(message.payload);
  };
}

/**
 * Kick off the app.
 *
 * This will resolve with the `sc` object only when we've received the Initialize data,
 * i.e. when app is able to start loading.
 */
export const connectScreenCloud = async <TConfig = AppConfig>(
  testData?: Partial<InitializeMessagePayload<TConfig>>
): Promise<ScreenCloud<TConfig>> => {
  sc = new ScreenCloud<TConfig>();
  await sc.connect(testData);
  return sc as ScreenCloud<TConfig>;
};

/**
 * Get the SC instance.
 */
export const getScreenCloud = <TConfig = AppConfig>(): ScreenCloud<TConfig> => {
  if (!sc) {
    console.warn(
      LOG_PREFIX +
        "Tried to fetch the SC object before app was initialized. Call startApp() first (which will also return the SC object)."
    );
  }

  return sc as ScreenCloud<TConfig>;
};
