/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ConnectionMode,
  useEdgesState,
  addEdge,
  useNodesState,
  MiniMap,
  Panel,
  updateEdge,
  ConnectionLineType,
} from "reactflow";
import * as Toast from "@radix-ui/react-toast";
import DropdownMenu from "./components/ui/dropDownMenu";
import { Sourcebody } from "./components/nodes/sourcebody";
import { Destinationbody } from "./components/nodes/destinationbody";
import { Functionbody } from "./components/nodes/functionbody";
import { AddFunction } from "./components/nodes/addFunction";
import OpenDialog from "./components/ui/jsonErrorDialog";
import DefaultEdge from "./components/edges/DefaultEdge";
import { DataFlowContextProvider } from "./lib/contexts";
import { HeaderMenu } from "./components/HeaderMenu";
import { edgeType, isConnectableEdge, mappingUpdate} from "./components/nodes/utils";
import DialogConfirmSave from "./components/dialogs/DialogConfirmSave";
import DialogOpen from "./components/dialogs/DialogOpen";
import DialogSaveAs from "./components/dialogs/DialogSaveAs";
import DialogConfirmOverwrite from "./components/dialogs/DialogConfirmOverwrite";
import DialogOutput from "./components/dialogs/DialogOutput";
import DialogSessionTimeout from "./components/dialogs/DialogSessionTimeout";
import ToastSuccess from "./components/toasts/ToastSuccess";
import ToastError from "./components/toasts/ToastError";
import ToastMappingError from "./components/toasts/ToastMappingError";
import {
  CLOSING_TIME,
  RemoveSubAction,
  SaveSubAction,
  WrapperHeight,
  WrapperWidth,
  compareEdges,
  compareNodes,
  crud,
  generateRuleName,
  initialEdges,
  initialNodes,
  isPortal,
} from "@utils";
import type {
  Node,
  Edge,
  OnEdgeUpdateFunc,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  DefaultEdgeOptions,
} from "reactflow";
import type { MappingDataJsonGet } from "@types";
import { zinc } from "tailwindcss/colors";
import "@radix-ui/themes/styles.css";
import "reactflow/dist/style.css";
import "./css/customEdge.css";
import "./styles/toast.css";
import "./styles/scroll-area.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "./components/ui/alertDialog";
import { Theme, Button } from "@radix-ui/themes";

const NODE_TYPES: NodeTypes = {
  sourcebody: Sourcebody,
  destinationbody: Destinationbody,
  functionbody: Functionbody,
};

const EDGE_TYPES: EdgeTypes = {
  default: DefaultEdge,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  style: { strokeWidth: 3 },
  type: "straight",
};
const connectionLineStyle: CSSProperties = {
  strokeWidth: 3,
  stroke: "black",
};

const connectionLineType: ConnectionLineType = ConnectionLineType.Straight;

const minimapStyle: CSSProperties = {
  height: 120,
};

function App() {
  const [id, setId] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [tempRuleName, setTempRuleName] = useState("");
  const [version, setVersion] = useState(0);
  const saveSubAction = useRef<SaveSubAction>(SaveSubAction.CREATE_NEW);
  const removeSubAction = useRef<RemoveSubAction>(RemoveSubAction.NONE);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const preNodes = useRef<Node<any, string | undefined>[]>(nodes);
  const preEdges = useRef<Edge<any>[]>(edges);
  const [isError, setError] = useState(false);
  const [dataList, setDataList] = useState<MappingDataJsonGet[]>([]);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [confirmFlowRemove, setConfirmFlowRemove] = useState(false);
  const [dialogConfirmSave, setDialogConfirmSave] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSaveAs, setDialogSaveAs] = useState(false);
  const [dialogConfirmOverwrite, setDialogConfirmOverwrite] = useState(false);
  const [dialogOutput, setDialogOutput] = useState(false);
  const [dialogSessionTimeout, setDialogSessionTimeout] = useState(false);
  const [toastSuccess, setToastSuccess] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [toastMappingError, setToastMappingError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const [mappingErrorMsg, setMappingErrorMsg] = useState("");
  const [nodeSourceWrapperWidth, setNodeSourceWrapperWidth] = useState<string>(
    WrapperWidth.INIT
  );
  const [nodeSourceWrapperHeight, setNodeSourceWrapperHeight] =
    useState<string>(WrapperHeight.INIT);
  const [nodeDestinationWrapperWidth, setNodeDestinationWrapperWidth] =
    useState<string>(WrapperWidth.INIT);
  const [nodeDestinationWrapperHeight, setNodeDestinationWrapperHeight] =
    useState<string>(WrapperHeight.INIT);
  const timerRef = useRef(0);
  const [firstVisit, setFirstVisit] = useState(false);
  const [isMacOriPhoneSafariAndFirstVisit, setIsMacOriPhoneSafariAndFirstVisit] = useState(false);
  
  const providerValue = {
    nodes,
    setNodes,
    preNodes,
    edges,
    setEdges,
    preEdges,
    id,
    setId,
    ruleName,
    setRuleName,
    tempRuleName,
    setTempRuleName,
    version,
    setVersion,
    dataList,
    setDataList,
    saveSubAction,
    removeSubAction,
    isError,
    setError,
    errorMsg,
    setErrorMsg,
    confirmFlowRemove,
    setConfirmFlowRemove,
    dialogConfirmSave,
    setDialogConfirmSave,
    dialogOpen,
    setDialogOpen,
    dialogSaveAs,
    setDialogSaveAs,
    dialogConfirmOverwrite,
    setDialogConfirmOverwrite,
    dialogOutput,
    setDialogOutput,
    dialogSessionTimeout,
    setDialogSessionTimeout,
    toastSuccess,
    setToastSuccess,
    toastError,
    setToastError,
    errorCode,
    setErrorCode,
    toastMappingError,
    setToastMappingError,
    mappingErrorMsg,
    setMappingErrorMsg,
    nodeSourceWrapperWidth,
    setNodeSourceWrapperWidth,
    nodeSourceWrapperHeight,
    setNodeSourceWrapperHeight,
    nodeDestinationWrapperWidth,
    setNodeDestinationWrapperWidth,
    nodeDestinationWrapperHeight,
    setNodeDestinationWrapperHeight,
  };

  const onEdgeUpdate: OnEdgeUpdateFunc<any> = useCallback(
    (oldEdge, newConnection) => {
      // 接続可能チェック
      var [connecting, errorMsg] = isConnectableEdge(newConnection, edges, oldEdge);
      if (connecting && errorMsg == "" ) {
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      } else if (!connecting && errorMsg !== "") {
        setToastMappingError(false);
        setMappingErrorMsg(errorMsg);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setToastMappingError(true);
        }, 100);
      }
    },
    [edges, setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const type = edgeType(
        connection.source ?? "",
        connection.target ?? "",
        nodes
      );
      // 接続可能チェック
      var [connecting, errorMsg] = isConnectableEdge(connection, edges , null);
      if (connecting && errorMsg == "") {
        setEdges((eds: Edge[]) => addEdge({ ...connection, type }, eds));
      } else if (!connecting && errorMsg !== "") {
        setToastMappingError(false);
        setMappingErrorMsg(errorMsg);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setToastMappingError(true);
        }, 100);
      }
    },
    [edges, setEdges]
  );
  
  // タブキー押された際にマッピング再計算
  window.onkeydown = function (e) {
    if (e.keyCode == 9) {
      mappingUpdate(null);
    }
  }

  /**
   * Listen to the window unload event.
   *
   * @param {BeforeUnloadEvent | PageTransitionEvent} event
   */
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent | PageTransitionEvent) => {
      // Compare canvas data beacon.
      if (
        !(
          compareNodes(preNodes.current, nodes) &&
          compareEdges(preEdges.current, edges)
        )
      ) {
        event.preventDefault();
        // If there are some changes.
        // Open Confirm Save dialog
        // saveSubAction.current = SaveSubAction.EXIT;
        // setDialogConfirmSave(true);
        return;
      }
    },
    [preNodes, preEdges, nodes, edges]
  );

  const checkSessionStatus = async () =>
    await crud({ url: "/check-session-status", credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (!data.sessionValid) {
          // セッションが無効の場合、適切な処理を行う
          console.log("セッションがタイムアウトしました。");
          setDialogSessionTimeout(true);
          return;
        } else {
          console.log("セッションは有効です。");
          setDialogSessionTimeout(false);
          return;
        }
      });

  /**
   * Generate file name at init
   */
  //useEffect(() => generateRuleName(setRuleName, setTempRuleName), []);
  
  useEffect(() => {
    
    // Generate file name at init
    generateRuleName(setRuleName, setTempRuleName);
    
    console.log('Data Mapping Toolを開始しました');
    const userAgent = navigator.userAgent;
    
    // MacかiPhoneのSafari(Chromeを除く)正規表現パターン
    const pattern: RegExp = /(Macintosh|iPhone).*Version\/\d+\.\d+(?!.*Chrome).*Safari/;
    const isMacOriPhoneSafari: boolean = pattern.test(userAgent);

    // ローカルストレージからフラグを読み込む
    const visited = localStorage.getItem('visited');
    
    if(!visited) {
        setFirstVisit(true);
        localStorage.setItem('visited', 'true');
    }
    
    // MacかiPhoneのSafari(or Chrome)ユーザーが初回訪問であれば、フラグを更新してメッセージを表示
    if (isMacOriPhoneSafari && !visited) {
      setIsMacOriPhoneSafariAndFirstVisit(true);
    }
  }, []);

  /**
   * セッションタイムアウトポーリング
   */
  useEffect(() => {
    if (isPortal()) {
      // 初回ロード時に1分毎にポーリングを開始
      const intervalId = setInterval(() => {
        checkSessionStatus();
      }, 60000);

      // コンポーネントがアンマウントされる時にクリーンアップ
      return () => clearInterval(intervalId);
    }
  }, []); // 空のdependenciesを指定して初回のみ実行されるよう

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [preNodes, preEdges, nodes, edges]);

  return (
    <DataFlowContextProvider value={providerValue}>
      <Toast.Provider swipeDirection="right" duration={CLOSING_TIME}>
        <div className="flex flex-col w-screen h-screen ">
          <div className="z-10">
            <HeaderMenu />
          </div>
          <div className="w-full h-full">
            {/*<Canvus />*/}
            <ReactFlow
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onEdgeUpdate={onEdgeUpdate}
              onConnect={onConnect}
              connectionMode={ConnectionMode.Loose}
              connectionLineStyle={connectionLineStyle}
              connectionLineType={connectionLineType}
              defaultEdgeOptions={defaultEdgeOptions}
              className="z-1"
              deleteKeyCode={null}
            >
              <Background gap={12} size={2} color={zinc[200]} />
              <OpenDialog />
              <div className="flex flex-row ">
                {/*<関数ボタン />*/}
                <Panel className="ml-0 z-2" position="top-center">
                  <AddFunction />
                </Panel>
                {/*<左側変換元ボタン />*/}
                <Panel className="ml-16 z-2" position="top-left">
                  <DropdownMenu label="変換元" sorceFlg={true} />
                </Panel>
                {/*<右側変換先ボタン />*/}
                <Panel className="mr-16 z-2" position="top-right">
                  <DropdownMenu label="変換先" sorceFlg={false} />
                </Panel>
              </div>
              <Controls showInteractive={false} />
              <MiniMap style={minimapStyle} zoomable pannable />
            </ReactFlow>
          </div>
        </div>
        {/* Session Timeout Dialog */}
        <DialogSessionTimeout />
        {/* Open Dialog */}
        <DialogOpen />
        {/* Confirm Save Dialog */}
        <DialogConfirmSave />
        {/* Save as Dialog */}
        <DialogSaveAs />
        {/* Save as Dialog */}
        <DialogConfirmOverwrite />
        {/* Output Dialog */}
        <DialogOutput />
        {/* Success Toast */}
        <ToastSuccess />
        {/* Error Toast */}
        <ToastError />
        {/* MappingError Toast */}
        <ToastMappingError />
        {/* Public Toast Viewport */}
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
      
      {/* Mac, Safariでのブラウザボタン操作の注意アラート */}
      <Dialog open={isMacOriPhoneSafariAndFirstVisit}>
        <DialogTrigger asChild={true} />
        <DialogContent className="bg-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogDescription className="text-center">
              編集中のデータを未保存のままブラウザの「進む」「ブックマークのページへ遷移」を実行するとデータが保存されません。必ず保存してから操作してください。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Theme>
              <Button
                className="m-0.5 border-solid border text-white bg-[#0017c1] w-24"
                onClick={() => {
                  setIsMacOriPhoneSafariAndFirstVisit(false);
                }}
              >
                OK
              </Button>
            </Theme>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </DataFlowContextProvider>

  );
}

export default App;
