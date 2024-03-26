import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface SaveAsProps {
  handleSaveAsClick: MouseEventHandler<HTMLDivElement>;
}

const SaveAs: FC<SaveAsProps> = ({ handleSaveAsClick }) => (
  <MenubarItem onClick={handleSaveAsClick}>名前を付けて保存</MenubarItem>
);

export default memo(SaveAs);
