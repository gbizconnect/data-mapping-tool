import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/alertDialog";
import { Table, Theme, Button } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { mappingUpdate } from "../../components/nodes/utils";
import {
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SaveSubAction,
  formatTime,
  openExisting,
  isPortal,
  getList,
  WrapperWidth,
  WrapperHeight,
} from "@utils";
import { DataFlowContext } from "../../lib/contexts";
import type { Node } from "reactflow";

const DialogOpen = () => {
  const {
    setNodes,
    preNodes,
    setEdges,
    preEdges,
    setId,
    setRuleName,
    setTempRuleName,
    setVersion,
    dataList,
    saveSubAction,
    dialogOpen,
    setDialogOpen,
    setDialogSessionTimeout,
    setDataList,
    setNodeSourceWrapperWidth,
    setNodeSourceWrapperHeight,
    setNodeDestinationWrapperWidth,
    setNodeDestinationWrapperHeight,
  } = useContext(DataFlowContext);
  const [defaultValue, setDefaultValue] = useState("");

  /**
   * @type {FormEventHandler<HTMLFormElement>}
   */
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));

      openExisting(data.id.toString()).then((response) => {
        if (isPortal() && response.sessionValid === false) {
          setDialogSessionTimeout(true);
          return;
        }

        const oldNodes = JSON.parse(response.nodes);
        let newNodes: Node[] = [];
        let hasSource = false;
        let hasDestination = false;
        const initStyle = {
          style: {
            width: WrapperWidth.INIT,
            height: WrapperHeight.INIT,
          },
        };
        oldNodes.forEach((node: Node) => {
          hasSource =
            hasSource || (!!node.type && node.type.indexOf("sourcebody") > -1);
          hasDestination =
            hasDestination ||
            (!!node.type && node.type.indexOf("destinationbody") > -1);
          newNodes = [...newNodes, { ...initStyle, ...node }];
        });
        setNodes(newNodes);
        setEdges(JSON.parse(response.edges));
        // Initialize canvas data beacon.
        preNodes.current = newNodes;
        preEdges.current = JSON.parse(response.edges);
        setId(response.id);
        setRuleName(response.file_name);
        setTempRuleName(response.file_name);
        setVersion(response.version);
        setNodeSourceWrapperWidth(
          hasSource ? WrapperWidth.FULL : WrapperWidth.INIT
        );
        setNodeSourceWrapperHeight(
          hasSource ? WrapperHeight.FULL : WrapperHeight.INIT
        );
        setNodeDestinationWrapperWidth(
          hasDestination ? WrapperWidth.FULL : WrapperWidth.INIT
        );
        setNodeDestinationWrapperHeight(
          hasDestination ? WrapperHeight.FULL : WrapperHeight.INIT
        );

        setDialogOpen(false);
        setTimeout(() => { mappingUpdate(newNodes)}, 1);
      });

      // Reset the sub action.
      saveSubAction.current = SaveSubAction.NONE;
    },
    []
  );

  /**
   * Execute cancel action.
   *
   * @type {MouseEventHandler<HTMLButtonElement>}
   */
  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setDialogOpen(false);
    // Reset the sub action.
    saveSubAction.current = SaveSubAction.NONE;
  };

  /**
   * Execute RadioGroup onValueChange action.
   *
   * @param {string} value
   * @returns {void}
   */
  const handleRadioGroupValueChange = (value: string): void =>
    setDefaultValue(value);

  /**
   * Execute getList method.
   *
   * @returns
   */
  const doGetList = async () => {
    await getList().then((response) => {
      setDataList(response.data);

      if (isPortal() && response.sessionValid === false) {
        setDialogSessionTimeout(true);
      }
    });
  };

  /**
   * Get the latest data at init
   */
  useEffect(() => {
    dialogOpen && doGetList();
  }, [dialogOpen]);

  useEffect(() => {
    dataList.length > 0 && setDefaultValue(dataList[0].id);
  }, [dataList]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>データマッピングルール選択</DialogTitle>
        </DialogHeader>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="w-6"></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="w-auto">
                名前
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="w-1/4">
                更新日時
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
        </Table.Root>
        <Form.Root
          // `onSubmit` only triggered if it passes client-side validation
          onSubmit={handleSubmit}
        >
          {!Array.isArray(dataList) || dataList.length === 0 ? (
            <div className="text-center mb-8">No data</div>
          ) : (
            <RadioGroup.Root
              aria-label="View density"
              name={"id"}
              asChild={true}
              value={defaultValue}
              onValueChange={handleRadioGroupValueChange}
            >
              <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                  <Table.Root>
                    <Table.Body>
                      {dataList.map((item) => {
                        const updateTime = new Date(item.update_time);
                        return (
                          <Table.Row key={item.id}>
                            <Table.Cell className="w-6">
                              <RadioGroup.Item
                                value={item.id}
                                id={item.id}
                                className="mx-px bg-white w-4 h-4 rounded-full border hover:bg-[var(--violet-3)] focus:shadow-[0_0_0_1px_black]"
                              >
                                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-[50%] after:bg-[#0017c1]" />
                              </RadioGroup.Item>
                            </Table.Cell>
                            <Table.RowHeaderCell className="w-auto">
                              <label htmlFor={item.id}>{item.file_name}</label>
                            </Table.RowHeaderCell>
                            <Table.Cell className="w-1/4">
                              <label htmlFor={item.id}>
                                {formatTime(updateTime, true)}
                              </label>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="ScrollAreaScrollbar"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar
                  className="ScrollAreaScrollbar"
                  orientation="horizontal"
                >
                  <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
              </ScrollArea.Root>
            </RadioGroup.Root>
          )}
          <DialogFooter>
            <Theme>
              {(!Array.isArray(dataList) || dataList.length > 0) && (
                <Button
                  className="m-0.5 border-solid border text-white bg-[#0017c1] w-20"
                  type="submit"
                >
                  開く
                </Button>
              )}
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

export default DialogOpen;
