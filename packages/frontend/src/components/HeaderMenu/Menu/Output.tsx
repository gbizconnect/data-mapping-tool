import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface OutputProps {
  handleOutputClick: MouseEventHandler<HTMLDivElement>;
}

const Output: FC<OutputProps> = ({ handleOutputClick }) => (
  <MenubarItem onClick={handleOutputClick}>出力</MenubarItem>
);

export default memo(Output);
