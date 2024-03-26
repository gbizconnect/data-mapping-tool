import * as Toast from "@radix-ui/react-toast";
import { DataFlowContext } from "lib/contexts";
import { useContext, useMemo } from "react";

const ToastMappingError = () => {
  const { toastMappingError, setToastMappingError, mappingErrorMsg } =
    useContext(DataFlowContext);
  const title = "マッピングエラー";
  const contentMessage = useMemo(() => mappingErrorMsg, [mappingErrorMsg]);

  return (
    <Toast.Root
      className="ToastRoot"
      open={toastMappingError}
      onOpenChange={setToastMappingError}
    >
      <Toast.Title className="ToastTitle">{title}</Toast.Title>
      <Toast.Description asChild>
        <div className="ToastDescription">{contentMessage}</div>
      </Toast.Description>
      <Toast.Action className="ToastAction" asChild altText={title}>
        <button className="Button small red">&times;</button>
      </Toast.Action>
    </Toast.Root>
  );
};

export default ToastMappingError;
