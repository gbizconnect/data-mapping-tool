import type { Node, Edge } from "reactflow";

export enum SaveSubAction {
  NONE = 0,
  CREATE_NEW = 1,
  OPEN = 2,
  SAVE_AS = 3,
  OVERWRITE_SAVE = 4,
  EXIT = 5,
}

export enum RemoveSubAction {
  NONE = 0,
  FUNCTION = 1,
}

export const initialNodes: Node[] = [];
export const initialEdges: Edge[] = [];

/**
 * The time in milliseconds that should elapse before automatically closing each toast.
 */
export const CLOSING_TIME: number = 5000;

export enum WrapperWidth {
  INIT = "280px",
  FULL = "100%",
}
export enum WrapperHeight {
  INIT = "490px",
  FULL = "100%",
}
