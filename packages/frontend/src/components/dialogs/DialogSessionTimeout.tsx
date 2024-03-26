import { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/alertDialog";
import { Theme, Button } from "@radix-ui/themes";
import { DataFlowContext } from "lib/contexts";

const DialogSessionTimeout = () => {
  const { dialogSessionTimeout, setDialogSessionTimeout } =
    useContext(DataFlowContext);

  return (
    <Dialog open={dialogSessionTimeout} onOpenChange={setDialogSessionTimeout}>
      <DialogTrigger asChild={true} />
      <DialogContent className="bg-white sm:max-w-[480px]">
        <DialogHeader>
          <DialogDescription>
            <p className="text-center">
              セッションが切断されました。
              <br />
              <a href="/top/menu" target="_blank">
                <u>gBizConnect Portal</u>
              </a>
              から再ログインしてください。
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Theme>
            <Button
              className="m-0.5 border-solid border text-white bg-[#0017c1] w-20"
              onClick={() => setDialogSessionTimeout(false)}
            >
              OK
            </Button>
          </Theme>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSessionTimeout;
