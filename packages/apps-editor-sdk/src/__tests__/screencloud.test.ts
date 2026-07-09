import { afterEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_INITIALIZE_PAYLOAD } from "../constants";
import { connectScreenCloud, getScreenCloud } from "../index";

const playerOrigin = "https://player.screencloud.test";

/** Build a message event as the Player would send it. */
const playerMessage = (message: object) =>
  new MessageEvent("message", {
    data: JSON.stringify({ data: message }),
    origin: playerOrigin,
  });

/** The legacy handshake success message, which tells the SDK its parent's origin. */
const connectSuccessMessage = () =>
  new MessageEvent("message", {
    data: `___${JSON.stringify({ type: "CONNECT_SUCCESS" })}`,
    origin: playerOrigin,
  });

describe("connectScreenCloud", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes immediately with testData, merging it over the sample payload, and auto-starts", async () => {
    const sc = await connectScreenCloud({ config: { greeting: "hi" } });

    expect(sc.getConfig()).toEqual({ greeting: "hi" });
    expect(sc.getContext().playerWidth).toBe(
      SAMPLE_INITIALIZE_PAYLOAD.context.playerWidth,
    );
    expect(sc.getContext().appId).toBe(SAMPLE_INITIALIZE_PAYLOAD.appId);

    await expect(sc.onAppStarted()).resolves.toBe(true);

    expect(getScreenCloud()).toBe(sc);
  });

  it("initializes from a player-sent message and starts when the player says so", async () => {
    const connecting = connectScreenCloud<{ greeting: string }>();

    window.dispatchEvent(
      playerMessage({
        type: "initialize",
        payload: {
          ...SAMPLE_INITIALIZE_PAYLOAD,
          config: { greeting: "from-player" },
        },
      }),
    );

    const sc = await connecting;

    expect(sc.getConfig()).toEqual({ greeting: "from-player" });

    window.dispatchEvent(playerMessage({ type: "start" }));
    await expect(sc.onAppStarted()).resolves.toBe(true);
  });

  it("answers a requestConfigUpdate from the player with the app's latest config", async () => {
    const sc = await connectScreenCloud({ config: {} });

    sc.onRequestConfigUpdate(async () => ({
      config: { greeting: "updated" },
    }));

    // The SDK only replies to origins it has completed the handshake with.
    window.dispatchEvent(connectSuccessMessage());

    const spy = vi
      .spyOn(window, "postMessage")
      .mockImplementation(() => undefined);

    window.dispatchEvent(
      playerMessage({ type: "requestConfigUpdate", payload: {} }),
    );

    await vi.waitFor(() => {
      expect(spy).toHaveBeenCalledWith(
        '{"data":{"config":{"greeting":"updated"}},"referenceId":1}',
        playerOrigin,
      );
    });
  });

  it("emits configUpdateAvailable to the player", async () => {
    const sc = await connectScreenCloud({ config: {} });

    window.dispatchEvent(connectSuccessMessage());

    const spy = vi
      .spyOn(window, "postMessage")
      .mockImplementation(() => undefined);

    sc.emitConfigUpdateAvailable();

    expect(spy).toHaveBeenCalledWith(
      '{"data":{"type":"configUpdateAvailable"}}',
      playerOrigin,
    );
  });
});
