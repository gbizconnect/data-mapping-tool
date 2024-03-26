import {
  useRef,
  useCallback,
  useContext,
  useState,
  useLayoutEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/alertDialog";
import { DataFlowContext } from "lib/contexts";
import {
  SaveSubAction,
  WrapperHeight,
  WrapperWidth,
  handleSaveSubAction,
  isPortal,
  putOverwriteSave,
} from "@utils";
import { Theme, Button } from "@radix-ui/themes";
import { CreateNewParams } from "@types";

const DialogConfirmSave = () => {
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
    setTempRuleName,
    version,
    setVersion,
    saveSubAction,
    setDialogOpen,
    setDialogSaveAs,
    dialogConfirmSave,
    setDialogConfirmSave,
    setDialogSessionTimeout,
    setToastSuccess,
    setToastError,
    setNodeSourceWrapperWidth,
    setNodeSourceWrapperHeight,
    setNodeDestinationWrapperWidth,
    setNodeDestinationWrapperHeight,
  } = useContext(DataFlowContext);
  const timerRef = useRef(0);
  const [dialogTitle, setDialogTitle] = useState(
    "変更内容が失われます。保存してから終了しますか？"
  );
  const [btnSaveText, setBtnSaveText] = useState("保存して終了");
  const [btnNotSaveText, setBtnNotSaveText] = useState("保存しないで終了");

  /**
   * Execute save action.
   *
   * @returns {Promise<void>}
   */
  const handleSaveClick = useCallback(async (): Promise<void> => {
    if (id) {
      // Overwite save
      await putOverwriteSave({
        id,
        ruleName,
        nodes,
        edges,
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
          setId(response.id);
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

      // Close all dialogs.
      setDialogConfirmSave(false);
      // Reset the sub action.
      saveSubAction.current = SaveSubAction.NONE;
    } else {
      // Open Save As dialog
      setDialogSaveAs(true);
      return;
    }
  }, [
    nodes,
    edges,
    id,
    ruleName,
    version,
    saveSubAction.current,
    timerRef.current,
  ]);

  /**
   * Execute NOT save action.
   *
   * @returns {void}
   */
  const handleNotSaveClick = useCallback((): void => {
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

    setDialogConfirmSave(false);
    // Reset the sub action.
    saveSubAction.current = SaveSubAction.NONE;
  }, [saveSubAction.current, preNodes.current, preEdges.current]);

  /**
   * Execute cancel action.
   *
   * @returns {void}
   */
  const handleCancelClick = (): void => {
    setDialogConfirmSave(false);
    // Reset the sub action.
    saveSubAction.current = SaveSubAction.NONE;
  };

  /**
   * ダイアログメッセージとボタン名を設定
   */
  useLayoutEffect(() => {
    switch (saveSubAction.current) {
      case SaveSubAction.CREATE_NEW:
        // 新規作成の場合
        setDialogTitle("変更内容が失われます。保存してから作成しますか？");
        setBtnSaveText("保存して作成");
        setBtnNotSaveText("保存しないで作成");
        break;

      case SaveSubAction.OPEN:
        // 開くの場合
        setDialogTitle("変更内容が失われます。保存してから開きますか？");
        setBtnSaveText("保存して開く");
        setBtnNotSaveText("保存しないで開く");
        break;

      default:
        // 終了の場合
        setDialogTitle("変更内容が失われます。保存してから終了しますか？");
        setBtnSaveText("保存して終了");
        setBtnNotSaveText("保存しないで終了");
        break;
    }
  }, [saveSubAction.current]);

  return (
    <Dialog open={dialogConfirmSave} onOpenChange={setDialogConfirmSave}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[480px]">
        <DialogHeader>
          <DialogDescription className="text-center">
            {dialogTitle}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Theme>
            <Button
              className="m-0.5 border-solid border text-white bg-[#0017c1] w-36"
              onClick={handleSaveClick}
            >
              {btnSaveText}
            </Button>
            <Button
              className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-36"
              onClick={handleNotSaveClick}
            >
              {btnNotSaveText}
            </Button>
            <Button
              className="m-0.5 border-solid border border-[#0017c1] text-[#0017c1] bg-white w-28"
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

export default DialogConfirmSave;
