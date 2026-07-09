import { describe, expect, it } from "vitest";
import { SAMPLE_INITIALIZE_PAYLOAD } from "../constants";
import { mergeInitializePayloads } from "../utils/objectUtils";

describe("mergeInitializePayloads", () => {
  it("returns the default payload when there is nothing to merge", () => {
    expect(mergeInitializePayloads(SAMPLE_INITIALIZE_PAYLOAD, {})).toEqual(
      SAMPLE_INITIALIZE_PAYLOAD,
    );
  });

  it("replaces top-level fields with values from the new payload", () => {
    const merged = mergeInitializePayloads(SAMPLE_INITIALIZE_PAYLOAD, {
      appId: "my-app",
      config: { hello: "there", meaningOfLife: 1 },
    });

    expect(merged.appId).toBe("my-app");
    expect(merged.config).toEqual({ hello: "there", meaningOfLife: 1 });
    expect(merged.orgId).toBe(SAMPLE_INITIALIZE_PAYLOAD.orgId);
  });

  it("deep-merges the context so partial overrides keep the defaults", () => {
    const merged = mergeInitializePayloads(SAMPLE_INITIALIZE_PAYLOAD, {
      context: { playerWidth: 800 } as never,
    });

    expect(merged.context.playerWidth).toBe(800);
    expect(merged.context.playerHeight).toBe(
      SAMPLE_INITIALIZE_PAYLOAD.context.playerHeight,
    );
  });
});
