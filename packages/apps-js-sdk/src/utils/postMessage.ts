import { GenericMessage } from "../types";

// TODO - postMessage natively serializes elements. Why do we JSON.stringify everything?
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

/**
 * Send a postMessage to the player.
 */
export const sendMessage = (
  message: GenericMessage,
  targetOrigin: string
): void => {
  const parent = window.parent || window.opener;
  if (!parent) {
    console.warn("Could not send message.", message);
    return;
  }

  const { type } = message;

  // Legacy compatibility:
  //    CONNECT, CONNECT_SUCCESS, DISCONNECT messages add a ___ prefix.
  //    The rest nest their data under a 2nd "data" key.
  let processedMessage;

  if (["CONNECT", "CONNECT_SUCCESS", "DISCONNECT"].includes(type)) {
    processedMessage = `___${JSON.stringify(message)}`;
  } else {
    processedMessage = JSON.stringify({
      data: message,
    });
  }

  console.log("Sending message", processedMessage);
  parent.postMessage(processedMessage, targetOrigin);
};
