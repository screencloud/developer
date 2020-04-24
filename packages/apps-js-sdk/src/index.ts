import {
  CONNECT_SUCCESS,
  INITIALIZE,
  LOG_PREFIX,
  SAMPLE_INITIALIZE_PAYLOAD,
} from "./constants";
import { connectMessage, initializedMessage, PlayerMessage } from "./messages";
import { AppConfig, InitializeMessagePayload, ScreenCloud } from "./types";
import { mergeInitializePayloads } from "./utils/objectUtils";
import { parseMessage, sendMessage } from "./utils/postMessage";

/**
 * Stateful values. Private to this module.
 */
let parentOrigin = ""; // What URL should postMessages be sent to?
let resolveInitialize: (value?: InitializeMessagePayload) => void;
let rejectInitialize: (reason?: any) => void;
let initializePayload: InitializeMessagePayload;

/**
 * Handle messages sent from the parent.
 */
const handleMessage = (message: PlayerMessage): void => {
  switch (message.type) {
    case CONNECT_SUCCESS:
      console.log(LOG_PREFIX + "Connected to parent player.");
      break;
    case INITIALIZE:
      if (initializePayload) {
        console.warn(
          LOG_PREFIX +
            "It looks like you've deployed with your testData included. This is likely a bug. Data and config from the player are being ignored."
        );
      } else {
        resolveInitialize(message.payload);
        console.log(LOG_PREFIX + "Initialized with data", message.payload);
      }

      sendMessage(initializedMessage());
      break;
  }
};

/**
 * PostMessage received. Parse it.
 */
const onMessage = (event: MessageEvent) => {
  try {
    const message = parseMessage(event);
    console.log(LOG_PREFIX + "Received message", message);

    // Use the URL of the responding SUCCESS event as the target for future messages.
    if (message.type === CONNECT_SUCCESS) {
      parentOrigin = event.origin;
    }

    handleMessage(message);
  } catch (e) {
    console.log(LOG_PREFIX + e);
  }
};

const getSc = <TAppConfig = AppConfig>(): ScreenCloud<TAppConfig> => {
  if (!initializePayload) {
    throw "Tried to get SC object before app was initialized.";
  }

  return {
    appId: initializePayload.appId,
    appStarted: false,
    config: initializePayload.config as TAppConfig, // TODO - Can remove casting if switching to an object.
    context: initializePayload.context,
  };
};

/**
 * Ensure we have the crucial INITIALIZE payload before continuing.
 *
 * If testData given, then merge with a sample payload, then resolve Initialize manually below with that object.
 * If the real initialize then comes later, warn user that they have shipped their test data to a real player.
 *
 * @return Promise, which will resolve when the async INITIALIZE payload has been received.
 */
const initialize = (testData?: Partial<InitializeMessagePayload>) => {
  return new Promise<InitializeMessagePayload>((resolve, reject) => {
    resolveInitialize = resolve;
    rejectInitialize = reject;

    if (testData) {
      const payload = mergeInitializePayloads(
        SAMPLE_INITIALIZE_PAYLOAD,
        testData
      );

      resolveInitialize(payload);
    }
  });
};

/**
 * Start the app.
 */
export const startApp = async <TAppConfig = AppConfig>(options?: {
  testData?: Partial<InitializeMessagePayload>; // Pass data in local development/testing, to initialize your app with. In particular; `testData.config`
}): Promise<ScreenCloud<TAppConfig>> => {
  window.addEventListener("message", onMessage, false);
  sendMessage(connectMessage());

  initializePayload = await initialize(options?.testData);
  return getSc<TAppConfig>();
};
