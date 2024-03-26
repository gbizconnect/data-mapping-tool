import {
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../../ui/menubar";
import CreateNew from "./CreateNew";
import OpenExisting from "./OpenExisting";
import OverwriteSave from "./OverwriteSave";
import SaveAs from "./SaveAs";
import Exit from "./Exit";
import Output from "./Output";
import { DataFlowContext } from "lib/contexts";
import { useRef, useCallback, useContext } from "react";
import {
  SaveSubAction,
  compareEdges,
  compareNodes,
  createNew,
  exit,
  isPortal,
  putOverwriteSave,
} from "@utils";
import { CreateNewParams } from "@types";

const Menu = () => {
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
    setDialogSaveAs,
    setDialogOpen,
    setDialogConfirmSave,
    setDialogOutput,
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
   * The Create New event.
   */
  const handleCreateNewClick = useCallback(() => {
    // Compare canvas data beacon.
    if (
      compareNodes(preNodes.current, nodes) &&
      compareEdges(preEdges.current, edges)
    ) {
      // If there is no change.
      // Create new action
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
      createNew(createNewParams);
    } else {
      // If there are some changes.
      // Open Confirm Save dialog
      saveSubAction.current = SaveSubAction.CREATE_NEW;
      setDialogConfirmSave(true);
      return;
    }
  }, [preNodes, preEdges, nodes, edges]);

  /**
   * The Open Existing event.
   */
  const handleOpenExistingClick = useCallback(() => {
    // Compare canvas data beacon.
    if (
      compareNodes(preNodes.current, nodes) &&
      compareEdges(preEdges.current, edges)
    ) {
      // If there is no change.
      // Open action
      setDialogOpen(true);
    } else {
      // If there are some changes.
      // Open Confirm Save dialog
      saveSubAction.current = SaveSubAction.OPEN;
      setDialogConfirmSave(true);
      return;
    }
  }, [preNodes.current, preEdges.current, nodes, edges]);

  /**
   * The Overwrite Save event.
   */
  const handleOverwriteSaveClick = useCallback(async () => {
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
          setTempRuleName(response.file_name);
          setVersion(response.version);

          return response;
        })
        .then((response) => {
          if (isPortal() && response && response.sessionValid === false) {
            setDialogSessionTimeout(true);
            return;
          }
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
    } else {
      // Open Save As dialog
      saveSubAction.current = SaveSubAction.OVERWRITE_SAVE;
      setDialogSaveAs(true);
      return;
    }
  }, [nodes, edges, id, saveSubAction.current, timerRef.current]);

  /**
   * The Save As event.
   */
  const handleSaveAsClick = useCallback(() => {
    // Open Save As dialog
    saveSubAction.current = SaveSubAction.SAVE_AS;
    setDialogSaveAs(true);
  }, []);

  /**
   * The Exit event.
   */
  const handleExitClick = useCallback(() => {
    // Compare canvas data beacon.
    if (
      compareNodes(preNodes.current, nodes) &&
      compareEdges(preEdges.current, edges)
    ) {
      // If there is no change.
      // Exit action
      if (isPortal()) {
        // Is a Java program.
        exit();
      } else {
        // Isn't a Java program.
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
        createNew(createNewParams);
      }
    } else {
      // If there are some changes.
      // Open Confirm Save dialog
      saveSubAction.current = SaveSubAction.EXIT;
      setDialogConfirmSave(true);
      return;
    }
  }, [preNodes, preEdges, nodes, edges]);

  /**
   * The Output event.
   */
  const handleOutputClick = useCallback(() => {
    setDialogOutput(true);
  }, []);

  return (
    <MenubarMenu>
      <MenubarTrigger>メニュー</MenubarTrigger>
      <MenubarContent className="bg-white">
        <CreateNew handleCreateNewClick={handleCreateNewClick} />
        <OpenExisting handleOpenExistingClick={handleOpenExistingClick} />
        <OverwriteSave handleOverwriteSaveClick={handleOverwriteSaveClick} />
        <SaveAs handleSaveAsClick={handleSaveAsClick} />
        <Output handleOutputClick={handleOutputClick} />
        <MenubarSeparator className="border-gray-200 border-t m-[1px]" />
        <Exit handleExitClick={handleExitClick} />
      </MenubarContent>
    </MenubarMenu>
  );
};

export default Menu;
