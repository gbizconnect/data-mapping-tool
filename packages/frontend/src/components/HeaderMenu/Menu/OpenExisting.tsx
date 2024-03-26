import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface OpenExistingProps {
  handleOpenExistingClick: MouseEventHandler<HTMLDivElement>;
}

const OpenExisting: FC<OpenExistingProps> = ({ handleOpenExistingClick }) => (
  <MenubarItem onClick={handleOpenExistingClick}>開く</MenubarItem>
);

export default memo(OpenExisting);
