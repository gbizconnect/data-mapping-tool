import {
  CreateNewParams,
  MappingDataJsonGet,
  MappingDataJsonSessionValid,
} from "@types";
import { SaveSubAction, createNew, crud, exit, isPortal } from "@utils";
import { Dispatch, SetStateAction } from "react";
import type { Node, Edge } from "reactflow";

interface SaveDataBaseTypes {
  nodes: Node[];
  edges: Edge[];
  ruleName: string;
}

interface SaveDataPutTypes extends SaveDataBaseTypes {
  id: string;
  version: number;
}

interface SaveDataPostTypes extends SaveDataBaseTypes {}

interface SaveDataPostForceTypes extends SaveDataBaseTypes {
  id: string;
  version: number;
}

/**
 * Overwite save method.
 *
 * @param {SaveDataTypes} data
 * @returns {Promise<MappingDataJsonSessionValid & MappingDataJsonGet>}
 */
export const putOverwriteSave = async (
  data: SaveDataPutTypes
): Promise<MappingDataJsonSessionValid & MappingDataJsonGet> => {
  const request = JSON.stringify({
    nodes: data.nodes,
    edges: data.edges,
    file_name: data.ruleName,
    id: data.id,
    version: data.version,
  });

  const response: Response = await crud({
    method: "PUT",
    url: `/${data.id}`,
    request,
  });

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(response.status);
};

/**
 * Create save method.
 *
 * @param {SaveDataTypes} data
 * @returns {Promise<MappingDataJsonSessionValid & MappingDataJsonGet>}
 */
export const postCreateSave = async (
  data: SaveDataPostTypes
): Promise<MappingDataJsonSessionValid & MappingDataJsonGet> => {
  const request = JSON.stringify({
    nodes: data.nodes,
    edges: data.edges,
    file_name: data.ruleName,
    version: 0,
    overWriteFlg: 0,
  });

  const response: Response = await crud({ method: "POST", request });

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(response.status);
};

/**
 * Force overwite save method.
 *
 * @param {SaveDataTypes} data
 * @returns {Promise<MappingDataJsonSessionValid & MappingDataJsonGet>}
 */
export const postForceOverwriteSave = async (
  data: SaveDataPostForceTypes
): Promise<MappingDataJsonSessionValid & MappingDataJsonGet> => {
  const request = JSON.stringify({
    nodes: data.nodes,
    edges: data.edges,
    file_name: data.ruleName,
    id: data.id,
    version: data.version,
    overWriteFlg: 1,
  });

  const response: Response = await crud({ method: "POST", request });

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(response.status);
};

/**
 * Execute sub action.
 *
 * @param {number} action
 * @param {Dispatch<SetStateAction<boolean>>} setDialogConfirmSave
 * @param {Dispatch<SetStateAction<boolean>>} setDialogOpen
 * @param {CreateNewParams} createNewParams
 * @param {string} ruleName
 */
export const handleSaveSubAction = (
  action: number,
  setDialogConfirmSave: Dispatch<SetStateAction<boolean>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  createNewParams: CreateNewParams,
  ruleName?: string
): void => {
  const { setRuleName } = createNewParams;

  setDialogConfirmSave(false);

  switch (action) {
    case SaveSubAction.CREATE_NEW:
      // Create new action
      createNew(createNewParams);
      break;

    case SaveSubAction.OPEN:
      // Open action
      setDialogOpen(true);
      break;

    case SaveSubAction.OVERWRITE_SAVE:
      // Overwrite action
      ruleName && setRuleName(ruleName);
      break;

    case SaveSubAction.SAVE_AS:
      // Save as action
      ruleName && setRuleName(ruleName);
      break;

    case SaveSubAction.EXIT:
      // Exit action
      if (isPortal()) {
        // Is a Java program.
        exit();
      } else {
        // Isn't a Java program.
        createNew(createNewParams);
      }
      break;

    default:
      break;
  }
};
