import { useState, useRef, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

const IconArrowDropDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path d="M480-360 280-560h400L480-360Z" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path d="M400-280v-400l200 200-200 200Z" />
  </svg>
);

export function NodeItemComponent({
  itemName,
  depth,
  parent,
  address,
  sourceFlg,
  openFlgAry,
  setOpenFlgAry,
  nodeId,
  scrollTop,
  scrollLeft,
  clientHeight,
  scrollWidth,
  clientWidth,
  resizeFlg,
}: {
  itemName: string;
  depth: number;
  parent: boolean;
  address: string;
  sourceFlg: boolean;
  openFlgAry: Array<string>;
  setOpenFlgAry: any;
  nodeId: string;
  scrollTop: number;
  scrollLeft: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
  resizeFlg: boolean;
}): JSX.Element {
  // IDはマッピング結果出力時に利用するため、階層を含めドット繋ぎとする
  var id = itemName;
  if (address != "") {
    id = address + "." + id;
  }

  // set Handle position according to this component
  const ref: React.MutableRefObject<any> = useRef(0);
  const updateNodeInternals = useUpdateNodeInternals();
  const [position, setPosition] = useState(ref.current.offsetTop);

  // step1: calculate offset from ref
  useEffect(() => {
    if (ref.current) {
      setPosition(ref.current.offsetTop);
    }
  });
  // step2: then propagate position
  useEffect(() => {
    if (ref.current) {
      setPosition(ref.current.offsetTop);
    }
  }, [position, updateNodeInternals]);

  // 折りたたみによる表示判定
  var visible = true;
  for (var i = 0; i < openFlgAry.length; i++) {
    if (address.startsWith(openFlgAry[i])) {
      visible = false;
      break;
    }
  }

  // 項目がスクロールによって見切れているか判定
  var overflowUpFlg = false;
  var overflowDownFlg = false;
  if (position - 30 < scrollTop) {
    overflowUpFlg = true;
  }
  if (position - 15 > scrollTop + clientHeight) {
    overflowDownFlg = true;
  }

  let srcScrollObj = document.getElementById("srcwrapper");
  let dstScrollObj = document.getElementById("dstwrapper");
  let srcWidthScrollFlg = false;
  let dstWidthScrollFlg = false;
  if (srcScrollObj != null) {
    if ((srcScrollObj.scrollWidth - srcScrollObj.clientWidth) > 0) {
      srcWidthScrollFlg = true;
    }
    if (dstScrollObj != null) {
      if ((dstScrollObj.scrollWidth - dstScrollObj.clientWidth) > 0) {
        dstWidthScrollFlg = true;
      }
    }
  }

  function openChange() {
    var newAry = Array.from(openFlgAry);
    if (newAry.includes(id)) {
      // 存在する場合は消す
      newAry.splice(newAry.indexOf(id), 1);
    } else {
      newAry.push(id);
    }
    setOpenFlgAry(newAry);
    // 開閉処理でマッピングがズレないよう処理を遅らせる
    setTimeout(()=>{updateNodeInternals(nodeId)},1);
  }

  return (
    <div>
      <div
        ref={ref}
        className={visible ? "flex m-0.5 bg-gray-100/80 " : ""}
        style={{
          top: visible ? "0px" : "-28px",
          width: scrollWidth,
          height: visible ? "38px" : "0px",
          position: "sticky",
          borderRadius: "0px",
          alignItems: "center",
          fontWeight: "400",
          direction: "ltr",
        }}
      >
        {/* 項目名 */}
        <div
          className={
            visible
              ? "text-left whitespace-nowrap px-0.5 flex items-center"
              : sourceFlg
                ? "hidden_source_" + id
                : "hidden_target_" + id
          }
          style={{ marginLeft: depth * 20 }}
        >
          &nbsp;
          {parent && (
            <button
              className="text-[#0017c1]"
              hidden={!visible}
              onClick={openChange}
            >
              {openFlgAry.includes(id) ? (
                <IconArrowRight />
              ) : (
                <IconArrowDropDown />
              )}
            </button>
          )}{" "}
          &nbsp;{visible ? itemName : ""}
          {/* スクロール範囲内のHundle（ノードのスクロールに追従する） */}
          {!overflowUpFlg && !overflowDownFlg && (
            <Handle
              id={id}
              hidden={parent}
              type={sourceFlg ? "source" : "target"}
              position={sourceFlg ? Position.Right : Position.Left}
              isConnectable={visible ? true : false}
              style={{
                width: resizeFlg ? "100%" :clientWidth + 'px',
                height: visible ? "100%" : "0%",
                marginLeft : scrollLeft,
                background: "500.0",
                top: visible ? "0px" : "-28px",
                left: 0,
                borderRadius: 0,
                transform: "none",
                border: "0",
                opacity: 0,
              }}
            />
          )}
        </div>
      </div>
      {/* スクロール範囲外のHundle（ノードの上下に固定描画するHundle） */}
      {(overflowUpFlg || overflowDownFlg) && (
        <Handle
          id={id}
          className={sourceFlg ? "right-0" : "left-0"}
          hidden={parent}
          type={sourceFlg ? "source" : "target"}
          position={sourceFlg ? Position.Right : Position.Left}
          isConnectable={false}
          style={{
            display: "false",
            top: sourceFlg ? overflowUpFlg ? 36 : srcWidthScrollFlg ? clientHeight + 54 : clientHeight + 42 :overflowUpFlg ? 36 : dstWidthScrollFlg ? clientHeight + 54 : clientHeight + 42,
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
