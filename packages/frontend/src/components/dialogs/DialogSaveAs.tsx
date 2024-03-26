import {
  FormEventHandler,
  MouseEventHandler,
  useRef,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/alertDialog";
import { Input } from "../ui/input";
import * as Form from "@radix-ui/react-form";
import {
  SaveSubAction,
  WrapperHeight,
  WrapperWidth,
  filterStr,
  handleSaveSubAction,
  isPortal,
  postCreateSave,
} from "@utils";
import { DataFlowContext } from "lib/contexts";
import { CreateNewParams } from "@types";
import { Theme, Button } from "@radix-ui/themes";

const DialogSaveAs = () => {
  // [名前を付けて保存]ダイアログ データマッピングルール名エラー表示フラグ
  const [contentMessage, setContentMessage] = useState<string>("");
  const {
    nodes,
    setNodes,
    preNodes,
    edges,
    setEdges,
    preEdges,
    setId,
    ruleName,
    setRuleName,
    tempRuleName,
    setTempRuleName,
    setVersion,
    saveSubAction,
    dialogSaveAs,
    setDialogOpen,
    setDialogSaveAs,
    setDialogConfirmSave,
    setDialogConfirmOverwrite,
    setDialogSessionTimeout,
    setToastSuccess,
    setToastError,
    setNodeSourceWrapperWidth,
    setNodeSourceWrapperHeight,
    setNodeDestinationWrapperWidth,
    setNodeDestinationWrapperHeight,
  } = useContext(DataFlowContext);
  const timerRef = useRef(0);

  /**
   * @type {FormEventHandler<HTMLFormElement>}
   */
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      let isForce = false;
      const data = Object.fromEntries(new FormData(event.currentTarget));

      // 前後の全角／半角スペースを削除する
      const value = data.rule_name.toString().trim();

      // Determine whether the input is legal.
      if (filterStr(value)) {
        setContentMessage(`/\\:?*"<>| 以外の文字で入力してください。`);
        return;
      } else {
        setContentMessage("");
      }

      // 0文字／スペースのみ／30文字以上入力した場合
      if (value.length === 0 || value.length > 30) {
        // エラーメッセージを表示にする
        setContentMessage("1～30文字以内で入力してください。");
        // 処理を終了する
        return;
      } else {
        setContentMessage("");
      }

      // 保存処理を行う
      await postCreateSave({
        ruleName: value,
        nodes,
        edges,
      })
        .then((response) => {
          if (isPortal() && response.sessionValid === false) {
            setDialogSessionTimeout(true);
            return;
          }
          // Initialize canvas data beacon.
          preNodes.current = JSON.parse(response.nodes);
          preEdges.current = JSON.parse(response.edges);
          // 存在するIDを保存する
          setId(response.id);
          // 存在するVersionを臨時保存する
          setVersion(response.version);

          // 既に存在するデータマッピングルール名を入力する場合
          if (!response.file_name) {
            // [保存確認]ダイアログを表示
            setDialogConfirmOverwrite(true);
            setDialogSaveAs(false);
            isForce = true;
            return;
          }

          setNodeSourceWrapperWidth(WrapperWidth.INIT);
          setNodeSourceWrapperHeight(WrapperHeight.INIT);
          setNodeDestinationWrapperWidth(WrapperWidth.INIT);
          setNodeDestinationWrapperHeight(WrapperHeight.INIT);

          // [名前を付けて保存]ダイアログを閉じる
          setDialogSaveAs(false);

          // 現処理を設定する
          saveSubAction.current =
            saveSubAction.current === SaveSubAction.NONE
              ? SaveSubAction.SAVE_AS
              : saveSubAction.current;

          // Execute the sub action.
          const createNewParams: CreateNewParams = {
            setNodes,
            setEdges,
            setId,
            setRuleName,
            setTempRuleName,
            setNodeSourceWrapperWidth,
            setNodeSourceWrapperHeight,
            setNodeDestinationWrapperWidth,
            setNodeDestinationWrapperHeight,
            preNodes,
            preEdges,
          };
          handleSaveSubAction(
            saveSubAction.current,
            setDialogConfirmSave,
            setDialogOpen,
            createNewParams,
            response && response.file_name
          );

          // Reset the sub action.
          saveSubAction.current = SaveSubAction.NONE;

          if (!isForce) {
            setToastSuccess(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
              setToastSuccess(true);
            }, 100);
          }
        })
        .catch((error) => {
          console.error(error);
          setToastError(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setToastError(true);
          }, 100);
        });
    },
    [
      nodes,
      edges,
      saveSubAction.current,
      timerRef.current,
      preNodes.current,
      preEdges.current,
    ]
  );

  /**
   * Execute cancel action.
   *
   * @type {MouseEventHandler<HTMLButtonElement>}
   */
  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setDialogSaveAs(false);
    setTempRuleName(ruleName);
  };

  return (
    <Dialog open={dialogSaveAs} onOpenChange={setDialogSaveAs}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[600px] ">
        <Form.Root
          // `onSubmit` only triggered if it passes client-side validation
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle>データマッピングルール名(30字以内)</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Input
                id="name"
                name={"rule_name"}
                className={
                  contentMessage
                    ? "col-span-4 rounded-[8px] border-red-500"
                    : "col-span-4 rounded-[8px]"
                }
                maxLength={30}
                value={tempRuleName}
                onChange={(event) => {
                  setTempRuleName(event.target.value);
                }}
                onBlur={(event) => {
                  setTempRuleName(event.target.value.trim());
                }}
              />
            </div>
            {contentMessage && (
              <p className="text-red-500 text-sm">{contentMessage}</p>
            )}
          </div>
          <DialogFooter>
            <Theme>
              <Button
                className="m-0.5 border-solid border text-white bg-[#0017c1] w-20"
                type="submit"
              >
                保存
              </Button>
              <Button
                className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-20"
                onClick={(event) => handleCancelClick(event)}
              >
                閉じる
              </Button>
            </Theme>
          </DialogFooter>
        </Form.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSaveAs;
