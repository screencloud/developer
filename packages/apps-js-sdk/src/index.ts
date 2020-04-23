import { ConnectMessage } from "./types";
import { sendMessage } from "./utils/postMessage";

export const Greeter = (name: string): string => `Hello ${name}`;

const onMessage = (event: MessageEvent): void => {
  try {
    const { origin, data } = event;

    console.log(event);
    console.log(data);
  } catch (e) {
    console.warn(e);
  }
};

window.addEventListener("message", onMessage, false);

(() => {
  const connectMessage: ConnectMessage = {
    type: "CONNECT",
  };
  sendMessage(connectMessage, "http://localhost:3010/");
})();
