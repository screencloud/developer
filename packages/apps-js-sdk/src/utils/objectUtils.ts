import { InitializeMessagePayload } from "../types";

/**
 * Combine 2 payloads, with data in newPayload replacing that in default.
 */
export const mergeInitializePayloads = <T>(
  defaultPayload: InitializeMessagePayload<T>,
  newPayload: Partial<InitializeMessagePayload<T>>
): InitializeMessagePayload<T> => {
  return {
    ...defaultPayload,
    ...newPayload,
    context: {
      ...defaultPayload.context,
      ...newPayload.context,
    },
  };
};
