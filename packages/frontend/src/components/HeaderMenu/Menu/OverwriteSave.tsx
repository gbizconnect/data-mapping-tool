import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface OverwriteSaveProps {
  handleOverwriteSaveClick: MouseEventHandler<HTMLDivElement>;
}

const OverwriteSave: FC<OverwriteSaveProps> = ({
  handleOverwriteSaveClick,
}) => <MenubarItem onClick={handleOverwriteSaveClick}>上書き保存</MenubarItem>;

export default memo(OverwriteSave);
