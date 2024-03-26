import { FC, MouseEventHandler, memo } from "react";
import { MenubarTrigger } from "../../ui/menubar";

interface HelpProps {
  handleHelpClick: MouseEventHandler<HTMLButtonElement>;
}

const Help: FC<HelpProps> = ({ handleHelpClick }) => (
  <MenubarTrigger onClick={handleHelpClick}>ヘルプ</MenubarTrigger>
);

export default memo(Help);
