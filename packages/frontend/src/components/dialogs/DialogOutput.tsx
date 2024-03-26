import { useContext, MouseEventHandler, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/alertDialog";
import { DataFlowContext } from "lib/contexts";
import { createConvertRule } from "components/nodes/utils";
import { Theme, Button } from "@radix-ui/themes";

const DialogOutput = () => {
  const { nodes, edges, ruleName, dialogOutput, setDialogOutput } =
    useContext(DataFlowContext);

  /**
   * Execute OK action.
   *
   * @type {MouseEventHandler<HTMLButtonElement>}
   */
  const handleOKClick: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      // create file in browser
      const json = JSON.stringify(createConvertRule(nodes, edges), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = document.createElement("a");
      link.href = href;
      link.download = ruleName + ".json";
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      setDialogOutput(false);
    }, [nodes, edges, ruleName]);

  return (
    <Dialog open={dialogOutput} onOpenChange={setDialogOutput}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[480px]">
        <DialogHeader>
          <DialogDescription>
            出力されたデータマッピングルールについて、自身のデータに問題なく適用されるかご確認ください。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Theme>
            <Button
              className="m-0.5 border-solid border text-white bg-[#0017c1] w-20"
              onClick={handleOKClick}
            >
              OK
            </Button>
          </Theme>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogOutput;
