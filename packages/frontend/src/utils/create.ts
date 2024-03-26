import { CreateNewParams } from "@types";
import {
  WrapperHeight,
  WrapperWidth,
  generateRuleName,
  initialEdges,
  initialNodes,
} from "@utils";

/**
 * The create action.
 *
 * @param {CreateNewParams} createNewParams
 * @returns {void}
 */
export const createNew = (createNewParams: CreateNewParams): void => {
  const {
    setNodes,
    setEdges,
    setId,
    setRuleName,
    setTempRuleName,
    setNodeSourceWrapperWidth,
    setNodeSourceWrapperHeight,
    setNodeDestinationWrapperWidth,
    setNodeDestinationWrapperHeight,
    preNodes,
    preEdges,
  } = createNewParams;

  setNodes(initialNodes);
  setEdges(initialEdges);
  setId("");
  generateRuleName(setRuleName, setTempRuleName);
  setNodeSourceWrapperWidth(WrapperWidth.INIT);
  setNodeSourceWrapperHeight(WrapperHeight.INIT);
  setNodeDestinationWrapperWidth(WrapperWidth.INIT);
  setNodeDestinationWrapperHeight(WrapperHeight.INIT);

  // Initialize canvas data beacon.
  preNodes.current = initialNodes;
  preEdges.current = initialEdges;
};
