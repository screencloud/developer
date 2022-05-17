import { LEGACY_PREFIXED_TYPES, LOG_PREFIX } from "../constants";
import { AppMessage, PlayerMessage } from "../messages";

// TODO - postMessage natively serializes elements. Why do we JSON.stringify everything?
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

/**
 * Send a postMessage to the player.
 */
export const sendMessage = (
  message: AppMessage,
  targetOrigin: string,
  referenceId?: number,
  requestId?: number
): void => {
  const parent = window.parent || window.opener;

  if (!parent) {
    console.log(LOG_PREFIX + "Could not send message.", message);
    return;
  }

  const { type } = message;

  // Backwards compatibility:
  //    CONNECT, CONNECT_SUCCESS, DISCONNECT messages add a ___ prefix.
  //    The rest nest their data under a 2nd "data" key.
  let processedMessage;

  if (LEGACY_PREFIXED_TYPES.includes(type)) {
    processedMessage = `___${JSON.stringify(message)}`;
  } else {
    processedMessage = JSON.stringify({
      data: message,
      referenceId,
      requestId,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log(LOG_PREFIX + "Sending message", message);
  }
  parent.postMessage(processedMessage, targetOrigin);
};

/**
 * Parse the string received from a parent into a typed Message.
 */
export const parseMessage = <T>(event: MessageEvent): PlayerMessage<T> => {
  const { origin, data } = event;
  if (origin === window.location.origin) {
    throw `Ignoring messages sent by the same origin (e.g. devtools): ${origin}`;
  }

  // Only CONNECT, CONNECT_SUCCESS, DISCONNECT messages add this ___ thing.
  // The rest nest their data under a 2nd "data" key.
  // TODO - Remove this complexity.
  try {
    const parsed =
      data.substr(0, 3) === "___"
        ? JSON.parse(data.substring(3))
        : JSON.parse(data).data;

    return parsed as PlayerMessage<T>;
  } catch (e) {
    throw e;
  }
};
