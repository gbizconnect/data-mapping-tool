import { RemoveSubAction } from "@utils";

/**
 * Execute sub action.
 *
 * @param {number} action
 */
export const handleRemoveSubAction = (action: number): void => {
  switch (action) {
    case RemoveSubAction.FUNCTION:
      // Function remove action
      break;

    default:
      break;
  }
};
