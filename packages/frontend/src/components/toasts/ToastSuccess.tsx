import * as Toast from "@radix-ui/react-toast";
import { DataFlowContext } from "lib/contexts";
import { useContext } from "react";

const ToastSuccess = () => {
  const { toastSuccess, setToastSuccess } = useContext(DataFlowContext);
  const contentMessage = "保存が完了しました。";

  return (
    <Toast.Root
      className="ToastRoot"
      open={toastSuccess}
      onOpenChange={setToastSuccess}
    >
      <Toast.Description asChild>
        <div className="ToastDescription">{contentMessage}</div>
      </Toast.Description>
      <Toast.Action className="ToastAction" asChild altText={contentMessage}>
        <button className="Button small green">&times;</button>
      </Toast.Action>
    </Toast.Root>
  );
};

export default ToastSuccess;
