import _ from "lodash";
import type { Node, Edge } from "reactflow";

/**
 * Whitelist method compares old and new data.
 *
 * @param {Node<any, string | undefined>[]} oldObj
 * @param {Node<any, string | undefined>[]} newObj
 * @returns {boolean}
 */
export const compareNodes = (
  oldObj: Node<any, string | undefined>[],
  newObj: Node<any, string | undefined>[]
): boolean => {
  if (oldObj.length !== newObj.length) return false;

  let result = true;
  for (let i = 0; i < oldObj.length; i++) {
    result =
      result &&
      oldObj[i].id === newObj[i].id &&
      oldObj[i].type === newObj[i].type &&
      _.isEqual(oldObj[i].position, newObj[i].position) &&
      oldObj[i].zIndex === newObj[i].zIndex &&
      oldObj[i].width === newObj[i].width &&
      oldObj[i].height === newObj[i].height &&
      oldObj[i].selected === newObj[i].selected &&
      _.isEqual(oldObj[i].positionAbsolute, newObj[i].positionAbsolute) &&
      oldObj[i].dragging === newObj[i].dragging &&
      oldObj[i].extent === newObj[i].extent &&
      _.isEqual(oldObj[i].style, newObj[i].style) &&
      // Data compare begin
      oldObj[i].data.label === newObj[i].data.label &&
      _.isEqual(oldObj[i].data.dataJson, newObj[i].data.dataJson) &&
      _.isEqual(oldObj[i].data.source, newObj[i].data.source) &&
      _.isEqual(oldObj[i].data.destination, newObj[i].data.destination) &&
      oldObj[i].data.functionName === newObj[i].data.functionName &&
      oldObj[i].data.functionLogic === newObj[i].data.functionLogic;

    if (!result) return false;
  }

  return true;
};

/**
 * Whitelist method compares old and new data.
 *
 * @param {Edge<any>[]} oldObj
 * @param {Edge<any>[]} newObj
 * @returns {boolean}
 */
export const compareEdges = (
  oldObj: Edge<any>[],
  newObj: Edge<any>[]
): boolean => {
  if (oldObj.length !== newObj.length) return false;

  let result = true;
  for (let i = 0; i < oldObj.length; i++) {
    result =
      result &&
      oldObj[i].id === newObj[i].id &&
      oldObj[i].type === newObj[i].type &&
      _.isEqual(oldObj[i].style, newObj[i].style) &&
      oldObj[i].source === newObj[i].source &&
      oldObj[i].sourceHandle === newObj[i].sourceHandle &&
      oldObj[i].target === newObj[i].target &&
      oldObj[i].targetHandle === newObj[i].targetHandle;

    if (!result) return false;
  }

  return true;
};
