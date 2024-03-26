import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { FunctionHeader } from "./functionHeader";
import type { SyntheticEvent } from "react";
import { FunctionItemComponent } from "./functionItem";
import { Children, useState } from "react";
import { NodeResizer, useNodes } from "reactflow";
import type { ResizeParams } from "reactflow";
import * as D3 from "d3";

export function Functionbody({ id, data, zIndex, selected }: NodeProps) {
  const [visible, setVisible] = useState(true);
  const [scrollTopSrc, setScrollTopSrc] = useState(0);
  const [scrollLeftSrc, setScrollLeftSrc] = useState(0);
  const [clientHeightSrc, setClientHeightSrc] = useState(150);
  const [clientWidthSrc, setClientWidthSrc] = useState(173);
  const [scrollWidthSrc, setScrollWidthSrc] = useState(173);
  const [scrollTopDst, setScrollTopDst] = useState(0);
  const [scrollLeftDst, setScrollLeftDst] = useState(0);
  const [clientHeightDst, setClientHeightDst] = useState(150);
  const [clientWidthDst, setClientWidthDst] = useState(173);
  const [scrollWidthDst, setScrollWidthDst] = useState(173);

  const [nodeHeight, setNodeHeight] = useState(192);
  const [nodeWidth, setNodeWidth] = useState(350);
  const [resizeFlg, setResizeFlg] = useState(false);

  //　スクロール時にEgde位置を再計算
  const updateNodeInternals = useUpdateNodeInternals();
  function updateNodesSrc(event: SyntheticEvent): void {
    setScrollTopSrc(event.currentTarget.scrollTop);
    setScrollLeftSrc(event.currentTarget.scrollLeft);
    if (widthScrollCheck(event.currentTarget.scrollWidth,event.currentTarget.clientWidth)){
      setClientHeightSrc(event.currentTarget.clientHeight+17);
    } else {
      setClientHeightSrc(event.currentTarget.clientHeight+12);
    }
    setClientWidthSrc(event.currentTarget.clientWidth-2);
    setScrollWidthSrc(event.currentTarget.scrollWidth-2);
    setTimeout(()=>{updateNodeInternals(id)},1);
    setResizeFlg(false);
  }
  function updateNodesDst(event: SyntheticEvent): void {
    setScrollTopDst(event.currentTarget.scrollTop);
    setScrollLeftDst(event.currentTarget.scrollLeft);
    if (widthScrollCheck(event.currentTarget.scrollWidth, event.currentTarget.clientWidth)) {
      setClientHeightDst(event.currentTarget.clientHeight + 17);
    } else {
      setClientHeightDst(event.currentTarget.clientHeight + 12);
    }
    setClientWidthDst(event.currentTarget.clientWidth-2);
    setScrollWidthDst(event.currentTarget.scrollWidth-2);
    setTimeout(()=>{updateNodeInternals(id)},1);
    setResizeFlg(false);
  }
  const functionWrapperId = id + "_funwrapper";
  const functionSrcWrapperId = id + "_funsrcwrapper";
  const functionDstWrapperId = id + "_fundstwrapper";

  const tempNodes = useNodes();
  function resizeWrapper(event, params, id, wrapper, srcwrapper, dstwrapper) {
    let targetObj = document.getElementById(wrapper);
    let targetObjsrc = document.getElementById(srcwrapper);
    let targetObjdst = document.getElementById(dstwrapper);
    tempNodes.map((node) => {
      if (node.id === id) {
        if (node.height != undefined && node.width != undefined) {
          if (targetObj != null) {
            targetObj.style.height = params.height - 44 + "px";
            targetObj.style.width = params.width - 4 + "px";
          }
          if (targetObjsrc != null) {
            targetObjsrc.style.height = params.height - 44 + "px";
            targetObjsrc.style.width = params.width - 4 + "px";
          }
          if (targetObjdst != null) {
            targetObjdst.style.height = params.height - 44 + "px";
            targetObjdst.style.width = params.width - 4 + "px";
          }

          return node;
        }
      }
    });
    setResizeFlg(true);
    if (targetObjsrc != null && targetObjdst != null) {
      setClientWidthSrc((params.width / 2) - 5);
      setClientWidthDst((params.width / 2) - 5);
      setScrollWidthSrc(targetObjsrc.scrollWidth - 4);
      setScrollWidthDst(targetObjdst.scrollWidth - 4);
      setScrollLeftSrc(targetObjsrc.scrollLeft);
      setScrollLeftDst(targetObjdst.scrollLeft);
      setClientHeightSrc(params.height - 36);
      setClientHeightDst(params.height - 36);

    }

  }
  //横スクロールが存在するかチェック
  const widthScrollCheck = (sWidth: any, cWidth: any) => {
    let widthScrollCheckFlg = false;
    if ((sWidth - cWidth) > 0) {
      widthScrollCheckFlg = true;
    }
    return widthScrollCheckFlg;
  }

  // NodeResizerのスタイル
  const lineStyle: React.CSSProperties = {
    borderWidth: "1px"
  };
  const handleStyle: React.CSSProperties = {
    width: "7px",
    height: "7px"
  };

  // 初期値を生成
  const [functionData, setData] = useState(data);

  return (
    <>
      <NodeResizer
        onResizeStart={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(
            event,
            params,
            id,
            functionWrapperId,
            functionSrcWrapperId,
            functionDstWrapperId
          );
        }}
        onResizeEnd={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(
            event,
            params,
            id,
            functionWrapperId,
            functionSrcWrapperId,
            functionDstWrapperId
          );
        }}
        onResize={(
          event: D3.D3DragEvent<any, any, any>,
          params: ResizeParams
        ) => {
          resizeWrapper(
            event,
            params,
            id,
            functionWrapperId,
            functionSrcWrapperId,
            functionDstWrapperId
          );
        }}
        isVisible={!visible ? false : selected ? true : false}
        minWidth={98}
        minHeight={100}
        lineStyle={lineStyle}
        handleStyle={handleStyle}
      />
      <div className={visible ? "border-2 border-slate-400" : ""}>
        <FunctionHeader
          id={id}
          data={functionData}
          setdata={setData}
          visible={visible}
          setVisible={setVisible}
          from={"from-white"}
          to={"to-white"}
          topColor={"border-t-[#212121]"}
          setNodeHeight={setNodeHeight}
          setNodeWidth={setNodeWidth}
          nodeHeight={nodeHeight}
          nodeWidth={nodeWidth}
          selected={selected}
        />
        <div
          id={functionWrapperId}
          className="bg-white w-full "
          style={{
            height: visible ? (nodeHeight - 42) + "px" : "5px",
            width: visible ? nodeWidth + "px" : "72px",
            visibility: visible ? "visible" : "hidden",
          }}
        >
          <div className="flex flex-auto">
            <div
              id={functionSrcWrapperId}
              className="grow flex flex-col w-50 functionSrcWrapper"
              style={{
                overflowX: "auto",
                overflowY: "auto",
                height: visible ?  (nodeHeight - 42) + "px" : "0px",
                width: "50%",
                visibility: visible ? "visible" : "hidden",
              }}
              onScroll={updateNodesSrc}
            >
              <>
                {Children.toArray(
                  data.source.map((item: any) => (
                    <>
                      <FunctionItemComponent
                        id={item.id}
                        itemName={item.itemName}
                        sourceFlg={false}
                        visible={visible}
                        scrollTop={scrollTopSrc}
                        scrollLeft={scrollLeftSrc}
                        clientHeight={clientHeightSrc}
                        clientWidth={clientWidthSrc}
                        scrollWidth={scrollWidthSrc}
                        resizeFlg={resizeFlg}
                      />
                    </>
                  ))
                )}
              </>
            </div>
            <div
              id={functionDstWrapperId}
              className="grow flex flex-col w-50 functionDstWrapper"
              style={{
                overflowX: "auto",
                overflowY: "auto",
                height: visible ?  (nodeHeight - 42) : "0px",
                width: "50%",
                visibility: visible ? "visible" : "hidden",
              }}
              onScroll={updateNodesDst}
            >
              <>
                {Children.toArray(
                  data.destination.map((item: any) => (
                    <>
                      <FunctionItemComponent
                        id={item.id}
                        itemName={item.itemName}
                        sourceFlg={true}
                        visible={visible}
                        scrollTop={scrollTopDst}
                        scrollLeft={scrollLeftDst}
                        clientHeight={clientHeightDst}
                        clientWidth={clientWidthDst}
                        scrollWidth={scrollWidthDst}
                        resizeFlg={resizeFlg}
                      />
                    </>
                  ))
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
