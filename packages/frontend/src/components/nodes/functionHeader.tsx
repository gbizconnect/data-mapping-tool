import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pencil1Icon, Cross1Icon, CaretUpIcon } from "@radix-ui/react-icons";
import { useState, useContext } from "react";
import { Node, useUpdateNodeInternals } from "reactflow";
import { findFunctionEdge, findNode, mappingUpdate } from "./utils";
import { DataFlowContext } from "../../lib/contexts";
import { FunctionDialog } from "./functionDialog";
import { v4 as uuidv4 } from "uuid";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FunctionHeader({
  id,
  data,
  setdata,
  visible,
  setVisible,
  from,
  to,
  topColor,
  setNodeHeight,
  setNodeWidth,
  nodeHeight,
  nodeWidth,
  selected
}) {
  // App.tsxから各種値を引継ぎ
  const { nodes, setNodes, edges } = useContext(DataFlowContext);
  // ダイアログ表示フラグ
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  // 適用ボタン押下時関数名変更、ダイアログを閉じる
  const updateNodeInternals = useUpdateNodeInternals();

  const layoutChange = (visible: boolean) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          if (visible) {
            if (node.style != undefined) {
              setNodeHeight(node.style?.height);
              setNodeWidth(node.style?.width);
            } else {
              setNodeHeight(nodeHeight);
              setNodeWidth(nodeWidth);
            }
            node.style = {
              ...node.style,
              height: 30,
              width: 40,
            };
          } else {
            node.style = {
              ...node.style,
              height: nodeHeight,
              width: nodeWidth,
            };
            mappingUpdate(nodes);
          }
        }
        console.log(node);
        return node;
      })
    );
    updateNodeInternals(id);
  };

  function handleNodeDelete(isConfirm: boolean) {
    const edge = findFunctionEdge(edges, id);
    // if (isConfirm && edge != undefined) {
    if (isConfirm) {
      // マッピング線がある場合、削除確認ダイアログを表示する
      setOpen3(true);
    } else {
      // 該当ノードを削除
      setNodes(nodes.filter((nodes, index) => nodes.id !== id));
    }
  }

  const addFunctionNode = (data: any) => {
    const node = findNode(nodes, id);
    node.selected = false;
    const newId = uuidv4() + "_function";
    let newData = { ...data };
    newData.source = [];
    newData.destination = [];

    for (var i = 0; i < data.source.length; i++) {
      newData.source.push({ id: newId + "_in_" + i, itemName: data.source[i].itemName });
    }
    for (var i = 0; i < data.destination.length; i++) {
      newData.destination.push({ id: newId + "_out_" + i, itemName: data.destination[i].itemName });
    }

    let newNode: Node = {
      id: newId,
      type: "functionbody",
      data: newData,
      position: { x: node.position.x, y: node.position.y + 200 },
      selected: true,
    };
    setNodes((nds) => nds.concat(newNode));
  }

  return (
    <>
      <div
        className="flex flex-row"
        style={{ display: visible ? "block" : "none" }}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between w-full h-10",
            "rounded-t-lg p-3 text-black font-medium",
            ["border-t-[5px]", topColor],
            [
              "bg-gradient-to-br",
              from, // gradient from
              to, // gradient to
            ]
          )}
          style={{ justifyContent: "center" }}
        >
          <div
            className={cn(
              "text-lg",
              "text-left",
              "w-[100%]",
              "max-w-[100%]",
              "whitespace-nowrap",
              "overflow-hidden",
              "overflow-ellipsis"
            )}
          >
            {data.functionName}
          </div>

          <FunctionDialog
            id={id}
            data={data}
            setdata={setdata}
            open1={open1}
            setOpen1={setOpen1}
            open2={open2}
            setOpen2={setOpen2}
            open3={open3}
            setOpen3={setOpen3}
            open4={open4}
            setOpen4={setOpen4}
          />
          {/* 編集ボタン */}
          <Pencil1Icon
            style={{ display: visible ? "block" : "none" }}
            className="flex h-6 w-7 text-[#0017c1]"
            onClick={() => setOpen1(!open1)}
          />
          {/* 関数コピーボタン */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="#0017c1"
            // style={{ display: visible ? "block" : "none" }}
            onClick={() => { addFunctionNode(data) }}>
            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
          </svg>
          {/* 縮小ボタン */}
          <CaretUpIcon
            className="h-6 w-6 text-[#0017c1]"
            style={{ display: visible ? "block" : "none" }}
            onClick={() => {
              {
                setVisible(!visible), layoutChange(visible);
              }
            }}
          />
          {/* 関数ノード削除ボタン */}
          <Cross1Icon
            className="h-6 w-6 text-[#0017c1]"
            style={{ display: visible ? "block" : "none" }}
            onClick={() => {
              handleNodeDelete(true);
            }}
          />
        </div>
      </div>
      {/* 拡大ボタン */}
      <div>
        <button
          id="CaretDownbutton"
          className="CaretDownbutton"
          style={{ 
            display: visible ? "none" : "block" ,
            borderColor: selected ? "#3367d9" : "#000",
            borderWidth: selected ? "2px" : "1px",
          }}
          onClick={() => {
            {
              setVisible(!visible), layoutChange(visible);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style={{ marginLeft: 6 }}><path d="M400-240v-80h62l105-120-105-120h-66l-64 344q-8 45-37 70.5T221-120q-45 0-73-24t-28-64q0-32 17-51.5t43-19.5q25 0 42.5 17t17.5 41q0 5-.5 9t-1.5 9q5-1 8.5-5.5T252-221l62-339H200v-80h129l21-114q7-38 37.5-62t72.5-24q44 0 72 26t28 65q0 30-17 49.5T500-680q-25 0-42.5-17T440-739q0-5 .5-9t1.5-9q-6 2-9 6t-5 12l-17 99h189v80h-32l52 59 52-59h-32v-80h200v80h-62L673-440l105 120h62v80H640v-80h32l-52-60-52 60h32v80H400Z" /></svg>
        </button>
      </div>
    </>
  );
}
