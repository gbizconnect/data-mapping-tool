import { useState, useRef, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals, useStore } from "reactflow";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export function FunctionItemComponent({
  id,
  itemName,
  sourceFlg,
  visible,
  scrollTop,
  scrollLeft,
  clientHeight,
  clientWidth,
  scrollWidth,
  resizeFlg,
}: {
  id: string;
  itemName: string;
  sourceFlg: boolean;
  visible: boolean;
  scrollTop: number;
  scrollLeft: number;
  clientHeight: number;
  clientWidth: number;
  scrollWidth: number;
  resizeFlg:boolean;
}): JSX.Element {
  // set Handle position according to this component
  const ref: React.MutableRefObject<any> = useRef(0);
  const updateNodeInternals = useUpdateNodeInternals();
  const [position, setPosition] = useState(ref.current.offsetTop);

  // step1: calculate offset from ref
  useEffect(() => {
    if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
      setPosition(ref.current.offsetTop);
    }
  });

  // step2: then propagate position
  useEffect(() => {
    updateNodeInternals(id);
  }, [position, updateNodeInternals]);

  // 項目がスクロールによって見切れているか判定
  var overflowUpFlg = false;
  var overflowDownFlg = false;
  if (visible) {
    if (position - 30 < scrollTop) {
      overflowUpFlg = true;
    }
    if (position - 15 > scrollTop + clientHeight) {
      overflowDownFlg = true;
    }
  }

  let widthScrollFlg = false;
  if ((scrollWidth - clientWidth) > 0) {
    widthScrollFlg = true;
  }

  return (
    <div>
      <div
        ref={ref}
        className={
          visible
            ? "flex py-2 m-0.5 p-0.5 bg-gray-100/80 max-h-[36px] min-h-[36px]"
            : ""
        }
        style={{
          top: visible ? "0px" : "-23px",
          width: resizeFlg ? "100%" : scrollWidth + 'px',
          height: visible ? "25%" : "0px",
          position: "relative",
          borderRadius: "0px",
          alignItems: "center",
          fontWeight: "400",
        }}
      >
        {/* 項目名 */}
        <div
          className={
            visible
              ? "text-left whitespace-nowrap px-0.5"
              : sourceFlg
                ? "hidden_source_" + id
                : "hidden_target_" + id
          }
        >
          {itemName}
        </div>

        {/* Hundle */}
        {!overflowUpFlg && !overflowDownFlg && (
          <Handle
            id={id}
            type={sourceFlg ? "source" : "target"}
            position={sourceFlg ? Position.Right : Position.Left}
            style={{
              width: visible ? resizeFlg ? "100%" : clientWidth : "0%",
              height: visible ? "100%" : "0%",
              marginLeft : scrollLeft,
              background: "500.0",
              top: 0,
              left: 0,
              borderRadius: 0,
              transform: "none",
              border: "0",
              opacity: 0,
            }}
          />
        )}
      </div>
      {/* スクロール範囲外のHundle（ノードの上下に固定描画するHundle） */}
      {(overflowUpFlg || overflowDownFlg) && (
        <Handle
          id={id}
          className={sourceFlg ? "right-0" : "left-0"}
          type={sourceFlg ? "source" : "target"}
          position={sourceFlg ? Position.Right : Position.Left}
          isConnectable={false}
          style={{
            display: "false",
            top: sourceFlg ? overflowUpFlg ? 37 : visible ? widthScrollFlg ? clientHeight + 32 :clientHeight + 32 : "0%" : overflowUpFlg ? 37 : visible ? widthScrollFlg ? clientHeight + 32 : clientHeight + 24 : "0%",
            borderRadius: 0,
            transform: "none",
            border: "0",
            opacity: 0,
            zIndex: -9999,
          }}
        />
      )}
    </div>
  );
}
