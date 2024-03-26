/* eslint-disable @typescript-eslint/no-explicit-any */
import { MappingDataJsonGet } from "@types";
import {
  RemoveSubAction,
  SaveSubAction,
  WrapperHeight,
  WrapperWidth,
} from "@utils";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
} from "react";
import type { Node, Edge } from "reactflow";

type DataFlowContextType = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  preNodes: MutableRefObject<Node<any, string | undefined>[]>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  preEdges: MutableRefObject<Edge<any>[]>;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  ruleName: string;
  setRuleName: Dispatch<SetStateAction<string>>;
  tempRuleName: string;
  setTempRuleName: Dispatch<SetStateAction<string>>;
  version: number;
  setVersion: Dispatch<SetStateAction<number>>;
  dataList: MappingDataJsonGet[];
  setDataList: Dispatch<SetStateAction<MappingDataJsonGet[]>>;
  saveSubAction: MutableRefObject<SaveSubAction>;
  removeSubAction: MutableRefObject<RemoveSubAction>;
  isError: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  errorMsg: string[];
  setErrorMsg: Dispatch<SetStateAction<string[]>>;
  confirmFlowRemove: boolean;
  setConfirmFlowRemove: Dispatch<SetStateAction<boolean>>;
  dialogConfirmSave: boolean;
  setDialogConfirmSave: Dispatch<SetStateAction<boolean>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogSaveAs: boolean;
  setDialogSaveAs: Dispatch<SetStateAction<boolean>>;
  dialogConfirmOverwrite: boolean;
  setDialogConfirmOverwrite: Dispatch<SetStateAction<boolean>>;
  dialogOutput: boolean;
  setDialogOutput: Dispatch<SetStateAction<boolean>>;
  dialogSessionTimeout: boolean;
  setDialogSessionTimeout: Dispatch<SetStateAction<boolean>>;
  toastSuccess: boolean;
  setToastSuccess: Dispatch<SetStateAction<boolean>>;
  toastError: boolean;
  setToastError: Dispatch<SetStateAction<boolean>>;
  errorCode: number;
  setErrorCode: Dispatch<SetStateAction<number>>;
  toastMappingError: boolean;
  setToastMappingError: Dispatch<SetStateAction<boolean>>;
  mappingErrorMsg: string;
  setMappingErrorMsg: Dispatch<SetStateAction<string>>;
  nodeSourceWrapperWidth: string;
  setNodeSourceWrapperWidth: Dispatch<SetStateAction<string>>;
  nodeSourceWrapperHeight: string;
  setNodeSourceWrapperHeight: Dispatch<SetStateAction<string>>;
  nodeDestinationWrapperWidth: string;
  setNodeDestinationWrapperWidth: Dispatch<SetStateAction<string>>;
  nodeDestinationWrapperHeight: string;
  setNodeDestinationWrapperHeight: Dispatch<SetStateAction<string>>;
};

export const DataFlowContext = createContext<DataFlowContextType>({
  nodes: [],
  setNodes: () => {},
  preNodes: { current: [] },
  edges: [],
  setEdges: () => {},
  preEdges: { current: [] },
  id: "",
  setId: () => {},
  ruleName: "",
  setRuleName: () => {},
  tempRuleName: "",
  setTempRuleName: () => {},
  version: 0,
  setVersion: () => {},
  dataList: [],
  setDataList: () => {},
  saveSubAction: { current: SaveSubAction.CREATE_NEW },
  removeSubAction: { current: RemoveSubAction.NONE },
  isError: false,
  setError: () => {},
  errorMsg: [],
  setErrorMsg: () => {},
  confirmFlowRemove: false,
  setConfirmFlowRemove: () => {},
  dialogConfirmSave: false,
  setDialogConfirmSave: () => {},
  dialogOpen: false,
  setDialogOpen: () => {},
  dialogSaveAs: false,
  setDialogSaveAs: () => {},
  dialogConfirmOverwrite: false,
  setDialogConfirmOverwrite: () => {},
  dialogOutput: false,
  setDialogOutput: () => {},
  dialogSessionTimeout: false,
  setDialogSessionTimeout: () => {},
  toastSuccess: false,
  setToastSuccess: () => {},
  toastError: false,
  setToastError: () => {},
  errorCode: 0,
  setErrorCode: () => {},
  toastMappingError: false,
  setToastMappingError: () => {},
  mappingErrorMsg: "",
  setMappingErrorMsg: () => {},
  nodeSourceWrapperWidth: WrapperWidth.INIT,
  setNodeSourceWrapperWidth: () => {},
  nodeSourceWrapperHeight: WrapperHeight.INIT,
  setNodeSourceWrapperHeight: () => {},
  nodeDestinationWrapperWidth: WrapperWidth.INIT,
  setNodeDestinationWrapperWidth: () => {},
  nodeDestinationWrapperHeight: WrapperHeight.INIT,
  setNodeDestinationWrapperHeight: () => {},
});

export function DataFlowContextProvider({
  value,
  children,
}: {
  value: DataFlowContextType;
  children: ReactNode;
}): JSX.Element {
  return (
    <DataFlowContext.Provider value={value}>
      {children}
    </DataFlowContext.Provider>
  );
}
