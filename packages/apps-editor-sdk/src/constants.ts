import { AppConfig, InitializeMessagePayload } from "./types";

// Message Types
export const CONNECT = "CONNECT";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const DISCONNECT = "DISCONNECT"; // Deprecated.
export const INITIALIZE = "initialize";
export const INITIALIZED = "initialized";
export const START = "start";
export const STARTED = "started";
export const REQUEST_CONFIG_UPDATE = "requestConfigUpdate";
export const CONFIG_UPDATE_AVAILABLE = "configUpdateAvailable";

// Message "type"s which prefix their string with ___
export const LEGACY_PREFIXED_TYPES = [CONNECT, CONNECT_SUCCESS, DISCONNECT];

// Prepended to the start of each log message
export const LOG_PREFIX = "[Apps SDK] ";

// Default INITIALIZE payload for local dev and testing.
export const SAMPLE_INITIALIZE_PAYLOAD: InitializeMessagePayload<AppConfig> = {
  appId: "test-app-111",
  appInstanceId: "test-instance-222",
  config: {
    hello: "world",
    meaningOfLife: 42,
  },
  context: {
    userInteractionEnabled: false,
    loggingLevel: 1,
    playerHeight: 1080,
    playerWidth: 1920,
    region: "eu",
    timezone: "Europe/London",
    appViewerToken: "",
  },
  orgId: "org-333",
  spaceId: "space-444",
  device: {},
  filesByAppInstanceId: { nodes: [] },
};
