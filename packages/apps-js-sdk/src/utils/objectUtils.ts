import { InitializeMessagePayload } from "../types";

/**
 * Combine 2 payloads, with data in newPayload replacing that in default.
 */
export const mergeInitializePayloads = (
  defaultPayload: InitializeMessagePayload,
  newPayload: Partial<InitializeMessagePayload>
): InitializeMessagePayload => {
  return {
    ...defaultPayload,
    ...newPayload,
    context: {
      ...defaultPayload.context,
      ...newPayload.context,
    },
  };
};
