import { describe, expect, it } from "vitest";
import { SAMPLE_INITIALIZE_PAYLOAD } from "../constants";
import { connectScreenCloud, getScreenCloud } from "../index";

const playerOrigin = "https://player.screencloud.test";

/** Build a message event as the Player would send it. */
const playerMessage = (message: object) =>
  new MessageEvent("message", {
    data: JSON.stringify({ data: message }),
    origin: playerOrigin,
  });

describe("connectScreenCloud", () => {
  it("initializes immediately with testData, merging it over the sample payload, and auto-starts", async () => {
    const sc = await connectScreenCloud({ config: { greeting: "hi" } });

    expect(sc.getConfig()).toEqual({ greeting: "hi" });
    // Fields not in the testData fall back to the sample payload.
    expect(sc.getContext().playerWidth).toBe(
      SAMPLE_INITIALIZE_PAYLOAD.context.playerWidth,
    );
    expect(sc.getContext().appId).toBe(SAMPLE_INITIALIZE_PAYLOAD.appId);

    // Providing testData automatically starts the app.
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
});
