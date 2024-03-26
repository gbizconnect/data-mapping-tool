import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Theme, Button } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "../ui/alertDialog";
import { useState, useContext } from "react";
import { findNodeEdge } from "./utils";
import { DataFlowContext } from "../../lib/contexts";
import { WrapperWidth, WrapperHeight } from "@utils";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Header({ id, from, to, topColor, label }) {
  // App.tsxから各種値を引継ぎ
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    setNodeSourceWrapperWidth,
    setNodeSourceWrapperHeight,
    setNodeDestinationWrapperWidth,
    setNodeDestinationWrapperHeight,
  } = useContext(DataFlowContext);

  // ダイアログ表示フラグ
  const [dialogConfirmFlowRemove, setDialogConfirmFlowRemove] = useState(false);

  // 削除処理
  function handleNodeDelete(isConfirm: boolean) {
    // const edge = findNodeEdge(edges, id);
    // if (isConfirm && edge != undefined) {
    if (isConfirm) {
      // マッピング線がある場合、削除確認ダイアログを表示する
      setDialogConfirmFlowRemove(true);
    } else {
      // 該当ノードを削除
      setNodes(nodes.filter((nodes, index) => nodes.id !== id));
      // 該当ノードに関連するEdgeを削除
      if (id.match("source")) {
        setEdges(edges.filter((edges, index) => edges.source !== id));
        setNodeSourceWrapperWidth(WrapperWidth.INIT);
        setNodeSourceWrapperHeight(WrapperHeight.INIT);
      } else {
        setEdges(edges.filter((edges, index) => edges.target !== id));
        setNodeDestinationWrapperWidth(WrapperWidth.INIT);
        setNodeDestinationWrapperHeight(WrapperHeight.INIT);
      }
    }
  }

  return (
    <div className="flex flex-row">
      <div
        className={cn(
          "flex flex-row items-center justify-between w-full h-[40px]",
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
            "text-center",
            "w-[100%]",
            "max-w-[100%]",
            "whitespace-nowrap",
            "overflow-hidden",
            "overflow-ellipsis"
          )}
        >
          {label}
        </div>

        {/* 関数ノード削除ボタン */}
        <Cross1Icon
          className="h-6 w-6 fixed right-3 text-[#0017c1]"
          onClick={() => {
            handleNodeDelete(true);
          }}
        />

        {/* ノード削除ボタン確認ダイアログ */}
        <Dialog open={dialogConfirmFlowRemove}>
          <DialogTrigger asChild={true} />
          <DialogContent className="bg-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogDescription className="text-center">
                マッピング情報も削除されますが、よろしいですか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Theme>
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1] w-24"
                  onClick={() => {
                    handleNodeDelete(false);
                  }}
                >
                  はい
                </Button>
                <Button
                  className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-24"
                  onClick={() => {
                    setDialogConfirmFlowRemove(false);
                  }}
                >
                  いいえ
                </Button>
              </Theme>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
