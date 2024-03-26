import { Theme, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React, { useState } from "react";
import { FunctionDialog } from "./functionDialog";
import { v4 as uuidv4 } from "uuid";

export const AddFunction: React.FC<{}> = ({}) => {
  // ダイアログ表示フラグ
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  // 初期値を生成
  var id = uuidv4() + "_function";
  var initData = {
    source: [{ id: id + "_in_0", itemName: "変換元データ項目0" }],
    destination: [{ id: id + "_out_0", itemName: "変換先データ項目0" }],
    functionName: "関数",
    functionLogic: "dst[0]=src[0]",
  };

  return (
    <div>
      <FunctionDialog
        key={id}
        id={id}
        data={initData}
        setdata={null}
        open1={open1}
        setOpen1={setOpen1}
        open2={open2}
        setOpen2={setOpen2}
        open3={open3}
        setOpen3={setOpen3}
        open4={open4}
        setOpen4={setOpen4}
      />
      <Theme>
        <Button
          variant="outline"
          className="border border-[#0017c1] text-[#0017c1] bg-white w-44"
          onClick={() => {
            setOpen1(true);
          }}
        >
          関数
        </Button>
      </Theme>
    </div>
  );
};

export default AddFunction;
