import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { useState } from "react";
import { ListItemComponent } from "./createListItemComponent";
import { Header } from "./header";
import type { SyntheticEvent } from "react";
import { NodeResizer, useNodes } from "reactflow";
import type { ResizeParams } from "reactflow";
import * as D3 from "d3";

export function Destinationbody({ id, data, zIndex, selected }: NodeProps) {
  // 開閉フラグ
  const [openFlgAry, setOpenFlgAry] = useState(new Array());
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [clientHeight, setClientHeight] = useState(450);
  const [clientWidth, setClientWidth] = useState(280);
  const [scrollWidth, setScrollWidth] = useState(280);
  const [resizeFlg, setResizeFlg] = useState(false);

  //　スクロール時にEgde位置を再計算
  const updateNodeInternals = useUpdateNodeInternals();
  function updateNodes(event: SyntheticEvent): void {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
    setClientHeight(event.currentTarget.clientHeight -5);
    setClientWidth(event.currentTarget.clientWidth - 2);
    setScrollWidth(event.currentTarget.scrollWidth - 2);
    setTimeout(()=>{updateNodeInternals(id)},1);
    setResizeFlg(false);
  }

  const tempNodes = useNodes();
  function resizeWrapper(event, params, id, wrapper) {
    let targetObj = document.getElementById(wrapper);
    tempNodes.map((node) => {
      if (node.id === id) {
        if (targetObj != null) {
          targetObj.style.height = params.height - 42 + "px";
          if ((targetObj.scrollWidth - targetObj.clientWidth) > 0) {
            setClientHeight(params.height - 60);    
          } else {
            setClientHeight(params.height - 36);
          }
          targetObj.style.width = params.width + "px";
        }
        return node;
      }
    });
    setResizeFlg(true);
    setClientWidth(params.clientWidth);
    setScrollLeft(params.scrollLeft);
    setScrollWidth(params.scrollWidth);
    updateNodeInternals(id);
    const elem2 = document.getElementById('dstwrapper')
    // イベント発火を遅らせて再描画後にupdateNodesを動かす
    if (elem2 !== null) {
      const triggerEvent = new Event('scroll')
      setTimeout(() => { elem2.dispatchEvent(triggerEvent) }, 1);
    }
  }

  // NodeResizerのスタイル
  const lineStyle: React.CSSProperties = {
    borderWidth: "1px"
  };
  const handleStyle: React.CSSProperties = {
    width: "7px",
    height: "7px"
  };

  return (
    <>
      <NodeResizer
        onResizeStart={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(event, params, id, "dstwrapper");
        }}
        onResizeEnd={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(event, params, id, "dstwrapper");
        }}
        onResize={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(event, params, id, "dstwrapper");
        }}
        isVisible={selected}
        minWidth={76}
        minHeight={100}
        lineStyle={lineStyle}
        handleStyle={handleStyle}
      />
      <div className="border-2 border-slate-400">
        <Header
          id={id}
          label={data.label}
          from={"from-white"}
          to={"to-white"}
          topColor={"border-t-[#fb8c00]"}
        />
        <div
          id="dstwrapper"
          className="bg-white w-full h-full "
          style={{
            overflowX: "auto",
            overflowY: "auto",
            height: "450px",
            width: "280px",
          }}
          onScroll={updateNodes}
        >
          <ListItemComponent
            items={data.dataJson}
            sourceFlg={false}
            openFlgAry={openFlgAry}
            setOpenFlgAry={setOpenFlgAry}
            nodeId={id}
            scrollTop={scrollTop}
            scrollLeft={scrollLeft}
            clientHeight={clientHeight}
            clientWidth={clientWidth}
            scrollWidth={scrollWidth}
            resizeFlg={resizeFlg}
          />
        </div>
      </div>
    </>
  );
}
