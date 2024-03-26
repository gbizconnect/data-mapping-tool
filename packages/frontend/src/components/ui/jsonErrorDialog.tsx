import { useContext, FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/alertDialog";
import { Theme, Button } from "@radix-ui/themes";
import { DataFlowContext } from "../../lib/contexts";

export const OpenDialog: FC = ({}) => {
  const { isError, setError, errorMsg, setErrorMsg } =
    useContext(DataFlowContext);
  return (
    <Dialog open={isError} onOpenChange={() => setError(!isError)}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogDescription className="text-center">
            {/* エラーメッセージ*/}
            {(() => {
              let msgArray = new Array();
              for (let i = 0; i < errorMsg.length; i++) {
                msgArray.push(<a>{errorMsg[i]}</a>);
                msgArray.push(<br />);
              }
              return msgArray;
            })()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Theme>
            <Button
              className="m-0.5 border-solid border text-white bg-[#0017c1] w-24"
              onClick={() => {
                setError(false);
                setErrorMsg([]);
              }}
            >
              OK
            </Button>
          </Theme>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenDialog;
