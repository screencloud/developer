export interface ScreenCloud<TConfig> {
  appStarted: boolean; // Is the app visible? (i.e. not preloading)
  context: AppContext;
  appId: string;
  config: TConfig;
  emitConfigUpdateAvailable: Function;
  onRequestConfigUpdate: Function;
  //   UNSAFE_onStart: Function;
  //   requestFile: Function;
  //   requestFiles: Function;
}

/**
 * The config for this specific instance.
 * This is set by users of your app inside Studio.
 */
export interface AppConfig {
  [
    key: string
  ]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}

type region = "eu" | "us";

interface PayloadAppContext {
  userInteractionEnabled: boolean; // If true, user is in an environment where they have some control, e.g. using a mouse on the embedded player.
  loggingLevel: number;
  playerHeight: number;
  playerWidth: number;
  region: region;
  timezone: string;
  appViewerToken: string;
}

export interface AppContext extends PayloadAppContext {
  appId: string;
  appInstanceId: string;
  orgId: string;
  spaceId: string;
  screenId?: string;
  device: DeviceConfig;
  filesByAppInstanceId: { nodes: Array<PlayerFile> };
  durationMs?: number;
  durationElapsedMs?: number;
}

export interface InitializeMessagePayload<TConfig> {
  appId: string;
  appInstanceId: string;
  config: TConfig;
  context: PayloadAppContext;
  orgId: string;
  spaceId: string;
  device: DeviceConfig;
  filesByAppInstanceId: { nodes: Array<PlayerFile> };
  durationMs?: number;
  durationElapsedMs?: number;
}

export type Platform =
  | "studio"
  | "android"
  | "firetv"
  | "chrome"
  | "ios"
  | "embeddable"
  | "msteams";

export interface DeviceConfig {
  platform?: Platform;
  model?: string;
  version?: string;
}

export type FileMediaType = "image" | "video" | "audio" | "document";

interface PlayerFileBase {
  availableAt: null | string;
  expireAt: null | string;
  height: number | undefined;
  id: string;
  name: string;
  size: number;
  width: number | undefined;
  type: FileMediaType;
  orgId: string;
}

export type Mimetype = string;

export interface ImageFile extends PlayerFileBase {
  type: "image";
  urlKey: string;
  mimetype: Mimetype;
}

export interface VideoFile extends PlayerFileBase {
  type: "video";
  urlKey: string;
  mimetype: Mimetype;
  thumbnail?: string;
}

export interface AudioFile extends PlayerFileBase {
  type: "audio";
  mimetype: Mimetype;
  urlKey: string;
}

export interface DocumentFile extends PlayerFileBase {
  type: "document";
  images: ImageFile[];
}

export type PlayerFile = ImageFile | VideoFile | AudioFile | DocumentFile;

export type RequestConfigType = "save" | "preview";

export interface ConfigPayload {
  config: AppConfig;
}
