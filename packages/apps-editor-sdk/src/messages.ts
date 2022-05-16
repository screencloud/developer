import { AppConfig } from "./../../apps-sdk/src/types";
import {
  CONNECT,
  CONNECT_SUCCESS,
  INITIALIZED,
  START,
  STARTED,
  REQUEST_CONFIG_UPDATE,
  CONFIG_UPDATE_AVAILABLE,
} from "./constants";
import {
  ConfigPayload,
  InitializeMessagePayload,
  RequestConfigType,
} from "./types";

/**
 * Messages created by the App, and sent to the Player.
 */
export type AppMessage =
  | ConnectMessage
  | InitializedMessage
  | StartedMessage
  | ConfigUpdateAvailableMessage
  | ConfigUpdateMessage;

/**
 * Messages created by the Player, and send to the app.
 */
export type PlayerMessage<T> =
  | ConnectSuccessMessage
  | InitializeMessage<T>
  | StartMessage
  | RequestConfigUpdateMessage;

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

export interface ConfigUpdateAvailableMessage {
  type: typeof CONFIG_UPDATE_AVAILABLE;
}

export const configUpdateAvailableMessage = (): ConfigUpdateAvailableMessage => {
  return {
    type: CONFIG_UPDATE_AVAILABLE,
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

export interface RequestConfigUpdateMessage {
  type: typeof REQUEST_CONFIG_UPDATE;
  payload: RequestConfigType;
}

export interface ConfigUpdateMessage {
  type: typeof REQUEST_CONFIG_UPDATE;
  payload: ConfigPayload;
}

export const configUpdateMessage = (
  appConfig: ConfigPayload
): ConfigUpdateMessage => {
  return {
    type: REQUEST_CONFIG_UPDATE,
    payload: appConfig,
  };
};
