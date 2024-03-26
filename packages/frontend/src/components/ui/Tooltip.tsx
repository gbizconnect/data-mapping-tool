import { FC, forwardRef, useState } from "react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { usePopperTooltip } from "react-popper-tooltip";

interface TooltipProps {
  title: string;
  tooltipText: string;
}

export const Tooltip: FC<TooltipProps> = forwardRef((props) => {
  const { title, tooltipText } = props;
  const [isVisible, setIsVisible] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      visible: isVisible,
      onVisibleChange: setIsVisible,
    });

  return (
    <div className="flex flex-row" ref={setTriggerRef}>
      <strong className="m-1">{title}</strong>
      <div ref={setTriggerRef}>
        <QuestionMarkCircledIcon className="m-0 p-1 h-7 w-7" />
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          <div className="text-sm">{tooltipText}</div>
        </div>
      )}
    </div>
  );
});
