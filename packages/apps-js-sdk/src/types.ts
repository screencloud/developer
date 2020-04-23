export interface GenericMessage {
  type: string;
  payload?: {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}

export interface ConnectMessage {
  type: "CONNECT";
}

export interface ConnectedMessage {
  type: "CONNECT_SUCCESS";
}
