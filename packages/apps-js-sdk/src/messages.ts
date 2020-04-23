import { CONNECT, CONNECT_SUCCESS, INITIALIZED } from "./constants";
import { InitializeMessagePayload } from "./types";

/**
 * Messages created by the App, and sent to the Player.
 */
export type AppMessage = ConnectMessage | InitializedMessage;

/**
 * Messages created by the Player, and send to the app.
 */
export type PlayerMessage = ConnectSuccessMessage | InitializeMessage;

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
/**
 * Messages the Parent can send
 */
export interface ConnectSuccessMessage {
  type: typeof CONNECT_SUCCESS;
}

export interface InitializeMessage {
  type: "initialize";
  payload: InitializeMessagePayload;
}
