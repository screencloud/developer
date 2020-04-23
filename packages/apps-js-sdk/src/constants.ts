// Message Types
export const CONNECT = "CONNECT";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const DISCONNECT = "DISCONNECT"; // Deprecated.
export const INITIALIZE = "initialize";
export const INITIALIZED = "initialized";

// Message "type"s which prefix their string with ___
export const LEGACY_PREFIXED_TYPES = [CONNECT, CONNECT_SUCCESS, DISCONNECT];
