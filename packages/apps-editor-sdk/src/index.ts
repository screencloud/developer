import {
  CONNECT,
  CONNECT_SUCCESS,
  INITIALIZE,
  LOG_PREFIX,
  SAMPLE_INITIALIZE_PAYLOAD,
  START,
  REQUEST_CONFIG_UPDATE,
} from "./constants";
import {
  AppMessage,
  connectMessage,
  initializedMessage,
  InitializeMessage,
  initializeMessage,
  PlayerMessage,
  startedMessage,
  configUpdateAvailableMessage,
  configUpdateMessage,
} from "./messages";
import {
  AppConfig,
  AppContext,
  InitializeMessagePayload,
  ConfigPayload,
  OnRequestConfigUpdate,
  EmitConfigUpdateAvailable,
  OnRequestConfigUpdateCallback,
} from "./types";
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
  private parentOrigin?: string;
  private resolveInitialize?: (
    value?: InitializeMessagePayload<TConfig>
  ) => void;
  private rejectInitialize?: (reason?: any) => void; // Not used yet. In theory, could time out after x. Otherwise any issue here likely means a Player problem.
  private initializePayload?: InitializeMessagePayload<TConfig>;

  private onAppStartedPromise: Promise<boolean>;
  private resolveOnAppStarted?: (value: boolean) => void;
  private getAppConfig?: OnRequestConfigUpdateCallback;

  constructor() {
    window.addEventListener("message", this.onMessage, false);
    this.sendMessage(connectMessage());

    this.onAppStartedPromise = new Promise<boolean>((resolve) => {
      this.resolveOnAppStarted = resolve;
    });
  }

  /**
   * Ensure we have the crucial Initialize payload before continuing.
   *
   * This is called automatically by connectScreenCloud(), you do not ever need to call it manually.
   *
   * If testData given, then merge with a sample payload, then resolve Initialize manually below with that object.
   * If the real initialize then comes later, warn user that they have shipped their test data to a real player.
   */
  public connect = async (
    testData?: Partial<InitializeMessagePayload<TConfig>>
  ) => {
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
   * Just call the connect() method (without using its testData option),
   * then `sc.initialize(yourData)` afterwards.
   *
   * This is useful in scenarios where you want to provide data from outside the
   * app codebase, e.g. an e2e test.
   *
   * Be careful not to call this in production however, as it will overrule
   * any data later received from the real player.
   */
  public initialize = (
    payload?: Partial<InitializeMessagePayload<TConfig>>
  ) => {
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
   * When running outside of a player, e.g. local development,
   * you can call this manually to "start" the app.
   * i.e. to tell your app to switch from preloading to "visible on screen" mode
   */
  public start = (): void => {
    this.handleStart();
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
   * Get information about the environment the app is running it.
   */
  public getContext = (): AppContext => {
    if (!this.initializePayload) {
      const err =
        "Error: Tried to getContext() before the app was initialized. Check that you waited for connectScreenCloud() to resolve before starting your app.";
      console.warn(LOG_PREFIX + err);
      throw err;
    }
    return {
      ...this.initializePayload?.context,
      appId: this.initializePayload?.appId,
      appInstanceId: this.initializePayload?.appInstanceId,
      orgId: this.initializePayload?.orgId,
      spaceId: this.initializePayload?.spaceId,
      device: this.initializePayload?.device,
      filesByAppInstanceId: this.initializePayload?.filesByAppInstanceId,
      durationMs: this.initializePayload?.durationMs,
      durationElapsedMs: this.initializePayload?.durationElapsedMs,
    };
  };

  /**
   * Has the app started? i.e. is it visible on screen, or still preloading?
   */
  public onAppStarted = (): Promise<boolean> => {
    return this.onAppStartedPromise;
  };

  /**
   * PostMessage received. Parse it.
   */
  private onMessage = (event: MessageEvent) => {
    try {
      const message = parseMessage<TConfig>(event);

      if (process.env.NODE_ENV === "development") {
        console.log(LOG_PREFIX + "Received message", message);
      }

      // Use the URL of the responding SUCCESS event as the target for future messages.
      if (message.type === CONNECT_SUCCESS) {
        // TODO - Whitelist to localhosts, 127.0.0.1, screen.cloud etc.
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
      case START:
        this.handleStart();
        break;
      case REQUEST_CONFIG_UPDATE:
        // send config to parent
        this.getAppConfig?.(message.payload).then(
          this.handleRequestConfigUpdate
        );
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
    this.sendMessage(initializedMessage());
    console.log(LOG_PREFIX + "Initialized with data", message.payload);
    this.resolveInitialize(message.payload);
  };

  /**
   * App is now on screen, update status to track this.
   */
  private handleStart = (): void => {
    if (this.resolveOnAppStarted) {
      this.resolveOnAppStarted(true);
    } else {
      console.warn(LOG_PREFIX + "Error: Could not resolve appStarted status.");
    }

    console.log(LOG_PREFIX + "Starting app on screen.");
    this.sendMessage(startedMessage());
  };

  /**
   * Handle sending the message with the app config payload back to the parent.
   */
  private handleRequestConfigUpdate = (appConfig: ConfigPayload): void => {
    console.log(LOG_PREFIX + "Emitting data", appConfig);
    this.sendMessage(configUpdateMessage(appConfig));
  };

  /**
   * PostMessage to parent (player).
   */
  private sendMessage = (message: AppMessage): void => {
    if (this.parentOrigin) {
      if (message.type === REQUEST_CONFIG_UPDATE) {
        // ReferenceId is always 1 for requestConfigUpdate. RequestConfigUpdate uses referenceId instead of type
        sendMessage(message.payload, this.parentOrigin, 1);
      } else {
        sendMessage(message, this.parentOrigin);
      }
    } else {
      // The initial CONNECT message can be sent to any origin.
      if (message.type === CONNECT) {
        sendMessage(message, "*");
      }
    }
  };

  /**
   * Send a message to the parent to tell it that something has changed and enable the option to save.
   */
  public emitConfigUpdateAvailable: EmitConfigUpdateAvailable = () => {
    this.sendMessage(configUpdateAvailableMessage());
  };

  /**
   * Allow the app to register a callback that can be called later to get the latest app config.
   */
  public onRequestConfigUpdate: OnRequestConfigUpdate = (
    getAppConfig
  ): void => {
    this.getAppConfig = getAppConfig;
  };
}

/**
 * Kick off the app.
 *
 * This will resolve with the `sc` object only when we've received the Initialize data,
 * i.e. when app is able to start loading.
 *
 * If you provide testData, we will assume you're running in development. Your test
 * data will be merged with sample data, then used to initialize the app.
 *
 * We will also automatically "start" the app (So you won't be stuck on preloading).
 *
 * To develop preloading locally, do not provide testData here.
 *
 * Instead, manually call `sc.initialize(testData)` and then `sc.start()` when you choose.
 */
export const connectScreenCloud = async <TConfig = AppConfig>(
  testData?: Partial<InitializeMessagePayload<TConfig>>
): Promise<ScreenCloud<TConfig>> => {
  sc = new ScreenCloud<TConfig>();
  await sc.connect(testData);

  if (testData) {
    sc.start();
  }

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
