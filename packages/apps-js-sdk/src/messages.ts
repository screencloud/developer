import {
  CONNECT,
  CONNECT_SUCCESS,
  INITIALIZED,
  START,
  STARTED,
} from "./constants";
import { InitializeMessagePayload } from "./types";

/**
 * Messages created by the App, and sent to the Player.
 */
export type AppMessage = ConnectMessage | InitializedMessage | StartedMessage;

/**
 * Messages created by the Player, and send to the app.
 */
export type PlayerMessage<T> =
  | ConnectSuccessMessage
  | InitializeMessage<T>
  | StartMessage;

export interface ConnectMessage {
  type: typeof CONNECT;
}

export const connectMessage = (): ConnectMessage => {
  return {
    type: CONNECT,
  };
};

export interface InitializedMessage {
  type: typeof INITIALIZED;
}

export const initializedMessage = (): InitializedMessage => {
  return {
    type: INITIALIZED,
  };
};

export interface StartedMessage {
  type: typeof STARTED;
}

export const startedMessage = (): StartedMessage => {
  return {
    type: STARTED,
  };
};

/**
 * Messages the Parent can send
 */
export interface ConnectSuccessMessage {
  type: typeof CONNECT_SUCCESS;
}

export interface InitializeMessage<T> {
  type: "initialize";
  payload: InitializeMessagePayload<T>;
}

export const initializeMessage = <T>(
  payload: InitializeMessagePayload<T>
): InitializeMessage<T> => {
  return {
    type: "initialize",
    payload,
  };
};

export interface StartMessage {
  type: typeof START;
}
