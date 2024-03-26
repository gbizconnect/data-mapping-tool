import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface ExitProps {
  handleExitClick: MouseEventHandler<HTMLDivElement>;
}

const Exit: FC<ExitProps> = ({ handleExitClick }) => (
  <MenubarItem onClick={handleExitClick}>終了</MenubarItem>
);

export default memo(Exit);
