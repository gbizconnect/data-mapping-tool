import * as Toast from "@radix-ui/react-toast";
import { DataFlowContext } from "lib/contexts";
import { useContext, useEffect } from "react";

const ToastError = () => {
  const { toastError, setToastError, errorCode } = useContext(DataFlowContext);
  const title = "エラーが発生しました。操作をやり直してください。";
  let contentMessage = "";

  useEffect(() => {
    switch (errorCode) {
      case 204:
        contentMessage = "Not Found";
        break;

      case 400:
        contentMessage = "Bad Request";
        break;

      case 417:
        contentMessage = "Expection Failed";
        break;

      default:
        break;
    }
  }, [errorCode]);

  return (
    <Toast.Root
      className="ToastRoot"
      open={toastError}
      onOpenChange={setToastError}
    >
      <Toast.Title className="ToastTitle">{title}</Toast.Title>
      <Toast.Description asChild>
        <div className="ToastDescription">{contentMessage}</div>
      </Toast.Description>
      <Toast.Action
        className="ToastAction"
        asChild
        altText={contentMessage || title}
      >
        <button className="Button small red">&times;</button>
      </Toast.Action>
    </Toast.Root>
  );
};

export default ToastError;
