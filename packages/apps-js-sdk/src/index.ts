import { CONNECT_SUCCESS, INITIALIZE } from "./constants";
import { connectMessage, initializedMessage, PlayerMessage } from "./messages";
import { InitializeMessagePayload } from "./types";
import { parseMessage, sendMessage } from "./utils/postMessage";

export const Greeter = (name: string): string => `Hello ${name}`;

let parentOrigin = "";
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

/**
 * Start the app.
 */
(() => {
  window.addEventListener("message", onMessage, false);
  sendMessage(connectMessage());
})();
