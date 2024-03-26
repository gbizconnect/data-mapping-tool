import React, { useState, useContext } from "react";
import "@radix-ui/themes/styles.css";
import { Theme, Button } from "@radix-ui/themes";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { TriangleRightIcon } from "@radix-ui/react-icons";
import stockData from "../data/dropDownMenuItem.json";
import { getDataJson } from "../data/constraints";
import { DataFlowContext } from "../../lib/contexts";
import { v4 as uuidv4 } from "uuid";
import { useViewport } from "reactflow";

// コンポーネントの処理（引数にlabel指定で任意の名前）
export const DropdownMenu: React.FC<{ label: string; sorceFlg: boolean }> = ({
  label,
  sorceFlg,
}) => {
  // ファイル名の更新
  const [name, setName] = useState<string>();
  // App.tsxから各種値を引継ぎ
  const { nodes, setNodes, setError, setErrorMsg } =
    useContext(DataFlowContext);
  const inputId = "file-input-" + sorceFlg;
  const { x, y, zoom } = useViewport();
  const Xpotion = x * -1;
  const Ypotion = y * -1;

  const addNode = (
    fileRead: boolean,
    data: any,
    filename: String,
    sorceFlg: any
  ) => {
    var newNode;
    var dataJson;
    //const crypto = require('crypto');

    if (!fileRead) {
      dataJson = getDataJson(data);
    } else {
      dataJson = data;
    }
    if (sorceFlg == true) {
      newNode = {
        id: uuidv4() + "_source",
        type: "sourcebody",
        position: { x: Xpotion / zoom + 5, y: (Ypotion + 80) / zoom },
        data: { label: filename, dataJson: dataJson },
      };
    } else {
      const windowSize = window.innerWidth;
      newNode = {
        id: uuidv4() + "_destination",
        type: "destinationbody",
        position: {
          x: (Xpotion + windowSize) / zoom - 290,
          y: (Ypotion + 80) / zoom,
        },
        data: { label: filename, dataJson: dataJson },
      };
    }
    // 新しいノードを既存のノードに連結(concat)
    setNodes((nds) => nds.concat(newNode));
  };

  // 読み込んだfileContentsがJSON.parseで有効か判定（文字列をJsonとして解析できるか）
  function tryParseJSON(jsonString) {
    try {
      // できた場合resultとして結果を返す
      const result = JSON.parse(jsonString);
      return result;
    } catch (error) {
      return null;
    }
  }

  // 非活性の制御
  var existsNode = false;
  for (var i = 0; i < nodes.length; i++) {
    if (sorceFlg && nodes[i].type == "sourcebody") {
      existsNode = true;
      break;
    }
    if (!sorceFlg && nodes[i].type == "destinationbody") {
      existsNode = true;
    }
  }

  return (
    <React.Fragment>
      <div className="flex justify-center">
        {/* ドロップダウンの内容 */}
        <Dropdown.Root>
          <Dropdown.Trigger asChild disabled={existsNode}>
            {/* 画面上のボタン配置 */}
            <Theme>
              <Button
                variant="outline"
                className="border border-[#0017c1] text-[#0017c1] bg-white w-44 disabled:text-[#949497] disabled:border-[#949497] hover:bg-[#F8F8FB] hover:underline data-[state=open]:bg-[#F8F8FB] data-[state=open]:underline"
                disabled={existsNode}
              >
                {label}
              </Button>
            </Theme>
          </Dropdown.Trigger>
          {/* ドロップダウンのコンテンツ */}
          <Dropdown.Content
            className="bg-white z-50 min-w-[12rem] overflow-hidden rounded-[8px] border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            align="start"
          >
            {/* JSONファイルを選択ボタン */}
            <Dropdown.Item
              className="relative flex cursor-default select-none items-center rounded-[8px] px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-[#F8F8FB] data-[highlighted]:underline data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={(): void => {
                const element = document.getElementById(
                  "file-input-" + sorceFlg
                );
                element?.click();
              }}
            >
              JSONファイルを選択
            </Dropdown.Item>
            <Dropdown.Separator className="border-gray-200 border-t m-[1px]" />
            <Dropdown.Sub>
              <Dropdown.SubTrigger className="relative flex cursor-default select-none items-center rounded-[8px] px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-[#F8F8FB] data-[highlighted]:underline data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                法人標準データ
                <TriangleRightIcon className="ml-auto mt-1 text-xs" />
              </Dropdown.SubTrigger>
              <Dropdown.Portal>
                <Dropdown.SubContent
                  className="bg-white z-50 min-w-[12rem] overflow-hidden rounded-[8px] border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                  sideOffset={4}
                  alignOffset={-5}
                >
                  {stockData.map((data, key) => (
                    // map関数内の複数の要素を返す
                    <React.Fragment key={key}>
                      {/*  mapのKeyを一つずつDropDownItemに表示*/}
                      <Dropdown.Item
                        className="relative flex cursor-default select-none items-center rounded-[8px] px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-[#F8F8FB] data-[highlighted]:underline data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        onSelect={() => {
                          addNode(
                            false,
                            data.jsonFile,
                            data.jsonFile,
                            sorceFlg
                          );
                        }}
                      >
                        {data.jsonFile}
                      </Dropdown.Item>
                      {/*  要素数マイナス1個分セパレート*/}
                      {key < stockData.length - 1 && (
                        <Dropdown.Separator className="border-gray-200 border-t m-[1px]" />
                      )}
                    </React.Fragment>
                  ))}
                </Dropdown.SubContent>
              </Dropdown.Portal>
            </Dropdown.Sub>
          </Dropdown.Content>
        </Dropdown.Root>

        {/* ファイル選択ダイアログ用の非表示のファイル入力フィールド */}
        <input
          type="file"
          id={inputId}
          className="hidden"
          accept=".json"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.currentTarget.files;
            // ファイルがなければ終了
            if (!files || files?.length === 0) return;
            // 先頭のファイルを取得
            const file = files[0];
            setName(file.name);

            const reader = new FileReader();
            // ファイル読み込み完了時に発火するリスナー
            reader.addEventListener("load", () => {
              // 読み込み結果を取得
              const fileContents = reader.result;
              // 結果がString型でとれていること
              if (typeof fileContents === "string") {
                // 結果がparseJsonできるかどうかtryParseJSON関数で判定
                const parsedJSON = tryParseJSON(fileContents);
                // parseJSONできなかったら警告
                if (parsedJSON === null) {
                  // エラーメッセージを出力
                  setError(true);
                  setErrorMsg([
                    "ファイルを読み取れません。",
                    "ファイルを修正するか、違うファイルを選択してください。",
                  ]);
                } else {
                  {
                    addNode(
                      true,
                      parsedJSON,
                      file.name.split(".").slice(0, -1).join("."),
                      sorceFlg
                    );
                  }
                }
              }
            });
            // 選択したファイルをUTF-8で読み込む処理
            reader.readAsText(file, "UTF-8");
            // ターゲットの初期化を行う。
            event.currentTarget.value = "";
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default DropdownMenu;
