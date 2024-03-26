import { Dispatch, SetStateAction, MutableRefObject } from "react";
import type { Node, Edge } from "reactflow";

export interface CreateNewParams {
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setId: Dispatch<SetStateAction<string>>;
  setRuleName: Dispatch<SetStateAction<string>>;
  setTempRuleName: Dispatch<SetStateAction<string>>;
  setNodeSourceWrapperWidth: Dispatch<SetStateAction<string>>;
  setNodeSourceWrapperHeight: Dispatch<SetStateAction<string>>;
  setNodeDestinationWrapperWidth: Dispatch<SetStateAction<string>>;
  setNodeDestinationWrapperHeight: Dispatch<SetStateAction<string>>;
  preNodes: MutableRefObject<Node<any, string | undefined>[]>;
  preEdges: MutableRefObject<Edge<any>[]>;
}
