import { Theme, Button } from "@radix-ui/themes";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/alertDialog";
import { useState, useContext, Children } from "react";
import { useUpdateNodeInternals, useViewport } from "reactflow";
import { findNode, findFunctionEdge } from "./utils";
import { DataFlowContext } from "../../lib/contexts";
import "react-popper-tooltip/dist/styles.css";
import { Input } from "components/ui/input";
import { Tooltip } from "components/ui/Tooltip";

export function FunctionDialog({
  id,
  data,
  setdata,
  open1,
  setOpen1,
  open2,
  setOpen2,
  open3,
  setOpen3,
  open4,
  setOpen4,
}) {
  const [changeData, setChangeData] = useState(data);
  const [initData, setInitData] = useState(data);
  const {nodes, setNodes, edges, setEdges } = useContext(DataFlowContext);
  // 更新フラグ
  const [updateflg, setUpdateflg] = useState(false);
  // 入力した関数名を更新
  const [deleteIndex, setDeleteIndex] = useState("");
  const [deleteEdgeId, setDeleteEdgeId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  // エラーメッセージ
  const [errMsg1, setErrMsg1] = useState("");
  const [errMsg2, setErrMsg2] = useState("");
  const [errMsg3, setErrMsg3] = useState(new Array());
  const [errMsg4, setErrMsg4] = useState(new Array());
  // 構文チェック用メッセージ
  const [successMsg, setSuccessMsg] = useState("");
  const [checkMsg, setcheckMsg] = useState("");
  const [checkFlg, setCheckFlg] = useState(false);

  const { x, y, zoom } = useViewport();
  const functionXpotion = x * -1;
  const functionYpotion = y * -1;

  // 適用ボタン押下時関数名変更、ダイアログを閉じる
  const updateNodeInternals = useUpdateNodeInternals();
  const onClickAddText = () => {
    // エラーチェック
    initializingErrInf();
    initializingMsgInf();
    var errCheck = false;
    var errMsg3Array = new Array();
    var errMsg4Array = new Array();
    if ("" === changeData.functionName || 30 < changeData.functionName.length) {
      setErrMsg1("1～30文字以内で入力してください。");
      errCheck = true;
    }

    if ("" === changeData.functionLogic || 10000 < changeData.functionLogic.length) {
      setErrMsg2("1～10000文字以内で入力してください。");
      errCheck = true;
    }

    var srcAry = changeData.functionLogic.match(/src\[\d+\]/g);
    if (srcAry != null) {
      for (var i = 0; i < srcAry.length; i++) {
        console.log()

        if (changeData.source.length < Number(srcAry[i].replace(/[^0-9]/g, "")) + 1) {
          setErrMsg2("配列「src」のインデックスには変換元データ項目の個数を超過しない値を入力してください。");
          errCheck = true;
        }
      }
    }

    var dstAry = changeData.functionLogic.match(/dst\[\d+\]/g);
    if (dstAry != null) {
      for (var i = 0; i < dstAry.length; i++) {
        console.log()

        if (changeData.destination.length < Number(dstAry[i].replace(/[^0-9]/g, "")) + 1) {
          setErrMsg2("配列「dst」のインデックスには変換元データ項目の個数を超過しない値を入力してください。");
          errCheck = true;
        }
      }
    }

    for (var i = 0; i < changeData.source.length; i++) {
      if (
        "" === changeData.source[i].itemName ||
        30 < changeData.source[i].itemName.length
      ) {
        errMsg3Array[i] = "　　　1～30文字以内で入力してください。";
        errCheck = true;
      } else {
        errMsg3Array[i] = "";
      }
    }
    setErrMsg3(errMsg3Array);

    for (var i = 0; i < changeData.destination.length; i++) {
      if (
        "" === changeData.destination[i].itemName ||
        30 < changeData.destination[i].itemName.length
      ) {
        errMsg4Array[i] = "　　　1～30文字以内で入力してください。";
        errCheck = true;
      } else {
        errMsg4Array[i] = "";
      }
    }
    setErrMsg4(errMsg4Array);

    if (errCheck) {
      if (open2) {
        // キャンセル確認ダイアログを表示されている場合、エラー状態を適用できないため閉じる
        setOpen2(false);
      }
      return;
    }

    setUpdateflg(false);
    setOpen2(false);
    setOpen1(false);
    const newData = { ...changeData };
    if (findNode(nodes, id) == undefined) {
      // 新規の場合、ノードを追加
      addFunctionNode(id, newData);
    } else {
      setdata(newData);
    }

    updateNodeInternals(id);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = newData;
        }
        return node;
      })
    );
  };

  const initializingErrInf = () => {
    setErrMsg1("");
    setErrMsg2("");
    setErrMsg3(new Array());
    setErrMsg4(new Array());
  };

  const initializingMsgInf = () => {
    setSuccessMsg("");
    setcheckMsg("");
  }

  const onClickLogicCheck = () => {
    // 変換前データ配列(src)
    let s = new Array();
    setcheckMsg("チェック中");
    setCheckFlg(true);
    for (var i = 0; i < changeData.source.length; i++) {
      var itemName = changeData.source[i].itemName;
      s.push(itemName);
    }

    // ユーザのコード指定実行により、変換後データ配列(dst)を作成
    var d = new Array();
    try {
      let code = changeData.functionLogic.replaceAll("\n", ";");
      let codeFunction = new Function("src", "dst", code);
      d = codeFunction(s, d);
    } catch (e) {
      setErrMsg2("");
      setTimeout(()=>{setcheckMsg("")},500);
      setTimeout(()=>{setCheckFlg(false);},500);
      setTimeout(()=>{setErrMsg2("次の構文エラーがあります。" + e)},500);
      setSuccessMsg("");
      return;
    }
    // エラーなし
    setSuccessMsg("");
    setTimeout(()=>{setcheckMsg("")},500);
    setTimeout(()=>{setCheckFlg(false);},500);
    setTimeout(()=>{setSuccessMsg("構文エラーはありません。")},500);
    setErrMsg2("");
    
  };

  const onClickAddsourceItem = () => {
    const nextIndex =
      Number(changeData.source[changeData.source.length - 1].id.match(/\d+$/)[0]) + 1;
    const newState = { ...changeData };
    newState.source.push({
      id: id + "_in_" + nextIndex,
      itemName: "変換元データ項目" + nextIndex,
    });
    setChangeData(newState);
  };

  const onClickAdddestinationItem = () => {
    const nextIndex =
      Number(
        changeData.destination[changeData.destination.length - 1].id.match(/\d+$/)[0]
      ) + 1;
    const newState = { ...changeData };
    newState.destination.push({
      id: id + "_out_" + nextIndex,
      itemName: "変換先データ項目" + nextIndex,
    });
    setChangeData(newState);
  };

  const onClickDeleteItem = (
    items: any,
    itemID: string,
    idx: string,
    isConfirm: boolean
  ) => {
    const edge = findFunctionEdge(edges, itemID);
    if (isConfirm && edge != undefined) {
      setDeleteTarget(items);
      setDeleteEdgeId(itemID);
      setDeleteIndex(idx);
      // 確認ダイアログを開く
      setOpen4(true);
    } else {
      items.splice(idx, 1);
      const newState = { ...changeData };
      setChangeData(newState);
      if (edge != undefined) {
        // 該当Edgeを削除
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      // テキスト項目を転記し直す
      let textKey = "_src_";
      if (itemID.includes(id + "_out_")) {
        textKey= "_dst_";
      }
      for (var i = 0; i < items.length; i++) {
        let obj = document.getElementById(id + textKey + i) as HTMLInputElement ;
        obj.value = items[i].itemName;
      }

      // 確認ダイアログを閉じる
      setOpen4(false);
    }
  };

  const setchangeFunctionName = (value: string) => {
    changeData.functionName = value;
    const newState = { ...changeData };
    setChangeData(newState);
  };

  const setchangeFunctionLogic = (value: string) => {
    changeData.functionLogic = value;
    const newState = { ...changeData };
    setChangeData(newState);
  };

  const onChangesourceItemName = (value: string, key: string) => {
    changeData.source[key].itemName = value;
    const newState = { ...changeData };
    setChangeData(newState);
  };

  const onChangedestinationItemName = (value: string, key: string) => {
    changeData.destination[key].itemName = value;
    const newState = { ...changeData };
    setChangeData(newState);
  };

  const handleNodeDelete = (isConfirm: boolean) => {
    const edge = findFunctionEdge(edges, id);
    if (isConfirm && edge != undefined) {
      // マッピング線がある場合、削除確認ダイアログを表示する
      setOpen3(true);
    } else {
      // 該当ノードを削除
      setNodes(nodes.filter((nodes, index) => nodes.id !== id));
    }
  };

  let newNode;
  const addFunctionNode = (id, newData) => {
    const windowSize = window.innerWidth;
    newNode = {
      id,
      type: "functionbody",
      data: newData,
      position: {
        x: (functionXpotion + windowSize / 2) / zoom - 150,
        y: (functionYpotion + 80) / zoom,
      },
      extent: "parent",
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div>
      {/* 関数編集ダイアログ */}
      <Dialog open={open1} onOpenChange={() => setOpen1(!open)}>
        <DialogContent
          className="bg-white sm:min-w-[700px] sm:min-h-[425px] sm:max-h-[700px]"
          style={{ overflowY: "auto" }}
        >
          <DialogHeader>
            <Tooltip
              title="関数名(30字以内)"
              tooltipText="関数オブジェクトのヘッダーとしてキャンバス上に表示する名称を設定してください（重複可）。"
            />
            <Input
              type="text"
              defaultValue={data.functionName}
              onChange={(event) => {
                setUpdateflg(true);
                setchangeFunctionName(event.target.value);
              }}
              className={
                errMsg1 === ""
                  ? "w-full border rounded-[8px] border-black"
                  : "w-full border rounded-[8px] border-red-500"
              }
            />
            <label className="text-sm text-red-500">{errMsg1} </label>
            <br />
            <Tooltip
              title="関数ロジック(10000字以内)"
              tooltipText="変換元データ項目は配列「src」、変換先データ項目は配列「dst」として、JavaScript（ECMAScript 5.1）で記載してください。"
            />
            <textarea
              onChange={(event) => {
                setUpdateflg(true);
                setchangeFunctionLogic(event.target.value);
              }}
              defaultValue={data.functionLogic}
              className={
                errMsg2 == ""
                  ? "w-full h-[200px] rounded-[8px] py-2 px-3 border border-black"
                  : "w-full h-[200px] rounded-[8px] py-2 px-3 border border-red-500"
              }
              onFocus={initializingMsgInf}
            />
            <table>
              <tr>
                <td>
                  <span >
                    <svg style={{ display: checkFlg ? "inline" : "none" }} width="22" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5ZM5 12.5C5 16.366 8.13401 19.5 12 19.5C15.866 19.5 19 16.366 19 12.5C19 8.63401 15.866 5.5 12 5.5C8.13401 5.5 5 8.63401 5 12.5Z" fill="#4979F5" />
                      <path d="M11.9988 3.99999C11.9988 3.17156 12.6741 2.48848 13.4932 2.61228C14.5511 2.77216 15.5797 3.10127 16.5387 3.58992C17.9448 4.30637 19.1614 5.34542 20.089 6.62213C21.0166 7.89885 21.6288 9.37697 21.8757 10.9356C22.1226 12.4943 21.997 14.0893 21.5094 15.5902C21.0217 17.091 20.1858 18.4552 19.0699 19.5711C17.954 20.6869 16.5899 21.5229 15.089 22.0106C13.5881 22.4982 11.9931 22.6237 10.4345 22.3769C9.37138 22.2085 8.34576 21.8701 7.39596 21.3777C6.66051 20.9964 6.5157 20.0468 7.00264 19.3766C7.48958 18.7064 8.42427 18.5753 9.1827 18.9085C9.73047 19.1492 10.3087 19.3196 10.9038 19.4138C11.9948 19.5866 13.1113 19.4987 14.1619 19.1574C15.2125 18.816 16.1674 18.2309 16.9486 17.4497C17.7297 16.6686 18.3148 15.7137 18.6562 14.6631C18.9976 13.6125 19.0854 12.496 18.9126 11.4049C18.7398 10.3139 18.3112 9.27919 17.6619 8.38549C17.0126 7.49179 16.161 6.76445 15.1767 6.26294C14.64 5.98943 14.072 5.78733 13.4874 5.66009C12.6779 5.48392 11.9988 4.82841 11.9988 3.99999Z" fill="#000082" />
                      <path d="M7.39558 21.3764C7.91311 21.6449 8.45315 21.8677 9.00949 22.0421C8.48722 21.7255 7.58834 21.0391 8.00098 20C8.3857 19.0312 9.17463 18.9901 9.4823 19.0312C9.38164 18.9924 9.2819 18.9512 9.18314 18.9078C8.42482 18.5743 7.49009 18.7051 7.00293 19.3752C6.51577 20.0452 6.66025 20.9948 7.39558 21.3764Z" fill="white" />
                      <path d="M14.7295 2.87957C14.3238 2.76448 13.9113 2.67516 13.4944 2.61215C12.6753 2.48835 12 3.17515 12 4.00358C12 4.82791 12.6756 5.48395 13.4813 5.65839C13.3541 5.47907 12.6797 4.89635 13 4C13.3203 3.10365 14.1163 2.72637 14.7295 2.87957Z" fill="white" />
                      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite" />
                    </svg>
                    <label className="text-sm text-Black-500">{checkMsg} </label>
                    <label className="text-sm text-red-500">{errMsg2} </label>
                    <label className="text-sm text-green-500">{successMsg} </label>&nbsp;
                  </span>
                </td>
                <td>
                  <div className="flex flex-row-reverse">
                    <Theme>
                      <Button
                        className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-28"
                        onClick={onClickLogicCheck}
                      >
                        構文チェック
                      </Button>
                    </Theme>
                  </div>
                </td>
              </tr>
            </table>
            <br />
            <div className="flex flex-auto">
              <div className="flex flex-col w-[310px]">
                <Tooltip
                  title="変換元データ項目(30字以内)"
                  tooltipText="テキストフォームには、関数オブジェクトの各変換元データ項目名としてキャンバス上に表示する名称を設定してください（重複可）。マッピングするデータ項目名と一致する必要はありません。"
                />
                <>
                  {Children.toArray(
                    data.source.map((item: any, idx: string) => (
                      <>
                        <div className="flex">
                          <label className="mx-2 my-3">src[{idx}]</label>
                          <Input
                            type="text"
                            id={id + "_src_" + idx}
                            defaultValue={item.itemName}
                            onChange={(event) => {
                              setUpdateflg(true);
                              onChangesourceItemName(event.target.value, idx);
                            }}
                            className={
                              errMsg3.length !== 0 &&
                              errMsg3[parseInt(idx)] != undefined &&
                              errMsg3[parseInt(idx)] !== ""
                                ? "m-1 p-1 w-[230px] rounded-[8px] border border-red-500"
                                : "m-1 p-1 w-[230px] rounded-[8px] border border-black"
                            }
                          />

                          {data.source.length != 1 && (
                            <MinusCircledIcon
                              className="mx-2 my-3 p-1 h-6 w-6"
                              onClick={() => {
                                setUpdateflg(true);
                                onClickDeleteItem(
                                  data.source,
                                  item.id,
                                  idx,
                                  true
                                );
                              }}
                            />
                          )}
                        </div>
                        <label className="text-sm text-red-500">
                          {errMsg3[idx]}{" "}
                        </label>
                      </>
                    ))
                  )}
                </>
                <PlusCircledIcon
                  className="mx-2 my-3 p-1 h-6 w-6"
                  onClick={() => {
                    setUpdateflg(true);
                    onClickAddsourceItem();
                  }}
                />
              </div>

              <div className="flex flex-col w-[310px]">
                <Tooltip
                  title="変換先データ項目(30字以内)"
                  tooltipText="テキストフォームには、関数オブジェクトの各変換先データ項目名としてキャンバス上に表示する名称を設定してください（重複可）。マッピングするデータ項目名と一致する必要はありません。"
                />
                <>
                  {Children.toArray(
                    data.destination.map((item: any, idx: string) => (
                      <>
                        <div className="flex">
                          <label className="mx-2 my-3">dst[{idx}]</label>
                          <Input
                            type="text"
                            id={id + "_dst_" + idx}
                            defaultValue={item.itemName}
                            onChange={(event) => {
                              setUpdateflg(true);
                              onChangedestinationItemName(
                                event.target.value,
                                idx
                              );
                            }}
                            className={
                              errMsg4.length !== 0 &&
                              errMsg4[parseInt(idx)] != undefined &&
                              errMsg4[parseInt(idx)] !== ""
                                ? "m-1 p-1 w-[230px] rounded-[8px] border border-red-500"
                                : "m-1 p-1 w-[230px] rounded-[8px] border border-black"
                            }
                          />
                          {data.destination.length != 1 && (
                            <MinusCircledIcon
                              className="mx-2 my-3 p-1 h-6 w-6"
                              onClick={() => {
                                setUpdateflg(true);
                                onClickDeleteItem(
                                  data.destination,
                                  item.id,
                                  idx,
                                  true
                                );
                              }}
                            />
                          )}
                        </div>
                        <label className="text-sm text-red-500">
                          {errMsg4[idx]}{" "}
                        </label>
                      </>
                    ))
                  )}
                </>
                <PlusCircledIcon
                  className="mx-2 my-3 p-1 h-6 w-6"
                  onClick={() => {
                    setUpdateflg(true);
                    onClickAdddestinationItem();
                  }}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row-reverse">
              <Theme>
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1] w-28"
                  onClick={onClickAddText}
                >
                  適用
                </Button>
                <Button
                  className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-28"
                  onClick={() => {
                    if (updateflg) {
                      // 画面表示時の値と異なる場合、キャンセル確認ダイアログを表示する
                      setOpen2(true);
                    } else {
                      setUpdateflg(false);
                      setOpen1(false);
                      initializingErrInf();
                      initializingMsgInf();
                    }
                  }}
                >
                  閉じる
                </Button>
              </Theme>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 閉じるボタン確認ダイアログ */}
      <Dialog open={open2} onOpenChange={() => setOpen2(!open2)}>
        <DialogContent className="bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogDescription>
              変更内容が失われます。よろしいですか。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="glow flex flex-col">
              <Theme>
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1]"
                  type="submit"
                  onClick={() => {
                    setUpdateflg(false);
                    setOpen1(false);
                    setOpen2(false);
                    initializingErrInf();
                    initializingMsgInf();
                  }}
                >
                  はい
                </Button>
                <Button
                  className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white"
                  type="submit"
                  onClick={() => {
                    setOpen2(false);
                    initializingErrInf();
                  }}
                >
                  いいえ
                </Button>
              </Theme>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ノード削除ボタン確認ダイアログ */}
      <Dialog open={open3}>
        <DialogContent className="bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogDescription>
              マッピング情報も削除されますが、よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row">
              <Theme>
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1] w-28"
                  type="submit"
                  onClick={() => {
                    handleNodeDelete(false);
                  }}
                >
                  はい
                </Button>
                <Button
                  className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-28"
                  type="submit"
                  onClick={() => {
                    setOpen3(false);
                  }}
                >
                  いいえ
                </Button>
              </Theme>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 関数ノードアイテム削除ボタン確認ダイアログ */}
      <Dialog open={open4}>
        <DialogContent className="bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogDescription>
              マッピング情報も削除されますが、よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row">
              <Theme>
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1] w-28"
                  type="submit"
                  onClick={() => {
                    onClickDeleteItem(
                      deleteTarget,
                      deleteEdgeId,
                      deleteIndex,
                      false
                    );
                  }}
                >
                  はい
                </Button>
                <Button
                  className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-28"
                  type="submit"
                  onClick={() => {
                    setOpen4(false);
                  }}
                >
                  いいえ
                </Button>
              </Theme>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
