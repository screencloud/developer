import { afterEach, describe, expect, it, vi } from "vitest";
import { connectMessage, startedMessage } from "../messages";
import { parseMessage, sendMessage } from "../utils/postMessage";

const playerOrigin = "https://player.screencloud.test";

describe("sendMessage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends legacy handshake messages with the ___ prefix", () => {
    const spy = vi
      .spyOn(window, "postMessage")
      .mockImplementation(() => undefined);

    sendMessage(connectMessage(), "*");

    expect(spy).toHaveBeenCalledWith('___{"type":"CONNECT"}', "*");
  });

  it("nests other messages under a data key", () => {
    const spy = vi
      .spyOn(window, "postMessage")
      .mockImplementation(() => undefined);

    sendMessage(startedMessage(), playerOrigin);

    expect(spy).toHaveBeenCalledWith(
      '{"data":{"type":"started"}}',
      playerOrigin,
    );
  });

  it("includes the referenceId when one is given", () => {
    const spy = vi
      .spyOn(window, "postMessage")
      .mockImplementation(() => undefined);

    sendMessage({ config: { greeting: "hi" } }, playerOrigin, 1);

    expect(spy).toHaveBeenCalledWith(
      '{"data":{"config":{"greeting":"hi"}},"referenceId":1}',
      playerOrigin,
    );
  });
});

describe("parseMessage", () => {
  it("parses legacy ___-prefixed messages", () => {
    const event = new MessageEvent("message", {
      data: `___${JSON.stringify({ type: "CONNECT_SUCCESS" })}`,
      origin: playerOrigin,
    });

    expect(parseMessage(event)).toEqual({ type: "CONNECT_SUCCESS" });
  });

  it("parses standard messages nested under a data key", () => {
    const event = new MessageEvent("message", {
      data: JSON.stringify({ data: { type: "start" } }),
      origin: playerOrigin,
    });

    expect(parseMessage(event)).toEqual({ type: "start" });
  });

  it("rejects messages sent from the app's own origin", () => {
    const event = new MessageEvent("message", {
      data: JSON.stringify({ data: { type: "start" } }),
      origin: window.location.origin,
    });

    expect(() => parseMessage(event)).toThrow();
  });

  it("throws on malformed message data", () => {
    const event = new MessageEvent("message", {
      data: "not json",
      origin: playerOrigin,
    });

    expect(() => parseMessage(event)).toThrow();
  });
});
