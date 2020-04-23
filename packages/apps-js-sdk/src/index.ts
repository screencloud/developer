import { CONNECT_SUCCESS, INITIALIZE } from "./constants";
import { connectMessage, initializedMessage, PlayerMessage } from "./messages";
import { InitializeMessagePayload, ScreenCloud } from "./types";
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
      console.log("Connected to parent player.");
      break;
    case INITIALIZE:
      resolveInitialize(message.payload);
      console.log("Initialized with data", message.payload);
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
    console.log(message);

    // Use the URL of the responding SUCCESS event as the target for future messages.
    if (message.type === CONNECT_SUCCESS) {
      parentOrigin = event.origin;
    }

    handleMessage(message);
  } catch (e) {
    console.log(e);
  }
};

const getSc = (): ScreenCloud => {
  if (!initializePayload) {
    throw "Tried to get SC object before app was initialized.";
  }

  return {
    appId: initializePayload.appId,
    appStarted: false,
    config: initializePayload.config,
    context: initializePayload.context,
  };
};

const initialize = () => {
  return new Promise<InitializeMessagePayload>((resolve, reject) => {
    resolveInitialize = resolve;
    rejectInitialize = reject;
  });
};

/**
 * Start the app.
 */
export const startApp = async (): Promise<ScreenCloud> => {
  window.addEventListener("message", onMessage, false);
  sendMessage(connectMessage());

  initializePayload = await initialize();
  return getSc();
};
