import { useRef, useCallback, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/alertDialog";
import {
  SaveSubAction,
  WrapperHeight,
  WrapperWidth,
  handleSaveSubAction,
  isPortal,
  postForceOverwriteSave,
} from "@utils";
import { DataFlowContext } from "lib/contexts";
import { Theme, Button } from "@radix-ui/themes";
import { CreateNewParams } from "@types";

const DialogConfirmOverwrite = () => {
  const {
    nodes,
    setNodes,
    preNodes,
    edges,
    setEdges,
    preEdges,
    id,
    setId,
    ruleName,
    setRuleName,
    tempRuleName,
    setTempRuleName,
    version,
    setVersion,
    saveSubAction,
    setDialogOpen,
    setDialogConfirmSave,
    dialogConfirmOverwrite,
    setDialogConfirmOverwrite,
    setDialogSaveAs,
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
   * Execute save action.
   *
   * @returns {Promise<void>}
   */
  const handleSaveClick = useCallback(async (): Promise<void> => {
    await postForceOverwriteSave({
      ruleName: tempRuleName,
      nodes,
      edges,
      id,
      version,
    })
      .then((response) => {
        if (isPortal() && response.sessionValid === false) {
          setDialogSessionTimeout(true);
          return;
        }
        // Initialize canvas data beacon.
        preNodes.current = JSON.parse(response.nodes);
        preEdges.current = JSON.parse(response.edges);
        // メニューバーに設定したデータマッピングルール名を表示する
        setRuleName(response.file_name);
        setVersion(response.version);
        setNodeSourceWrapperWidth(WrapperWidth.INIT);
        setNodeSourceWrapperHeight(WrapperHeight.INIT);
        setNodeDestinationWrapperWidth(WrapperWidth.INIT);
        setNodeDestinationWrapperHeight(WrapperHeight.INIT);

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
          createNewParams
        );

        // Close all dialogs.
        setDialogConfirmOverwrite(false);
        setDialogConfirmSave(false);
        // Reset the sub action.
        saveSubAction.current = SaveSubAction.NONE;

        setToastSuccess(false);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setToastSuccess(true);
        }, 100);
      })
      .catch((error) => {
        console.error(error);
        setToastError(false);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setToastError(true);
        }, 100);
      });
  }, [
    nodes,
    edges,
    id,
    ruleName,
    version,
    saveSubAction.current,
    timerRef.current,
    preNodes.current,
    preEdges.current,
  ]);

  /**
   * Execute cancel action.
   *
   * @returns {void}
   */
  const handleCancelClick = (): void => {
    // [保存確認]ダイアログを閉じる
    setDialogConfirmOverwrite(false);
    // [名前を付けて保存]ダイアログを表示する
    setDialogSaveAs(true);
    // Reset the sub action.
    saveSubAction.current = SaveSubAction.NONE;
  };

  return (
    <Dialog
      open={dialogConfirmOverwrite}
      onOpenChange={setDialogConfirmOverwrite}
    >
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogDescription className="text-center">
            指定されたデータマッピングルール名は既に存在します。上書き保存しますか？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Theme>
            <Button
              className="m-0.5 border-solid border text-white bg-[#0017c1] w-24"
              onClick={handleSaveClick}
            >
              はい
            </Button>
            <Button
              className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-24"
              onClick={handleCancelClick}
            >
              キャンセル
            </Button>
          </Theme>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirmOverwrite;
