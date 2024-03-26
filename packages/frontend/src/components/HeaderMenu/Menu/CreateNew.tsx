import { FC, MouseEventHandler, memo } from "react";
import { MenubarItem } from "../../ui/menubar";

interface CreateNewProps {
  handleCreateNewClick: MouseEventHandler<HTMLDivElement>;
}

const CreateNew: FC<CreateNewProps> = ({ handleCreateNewClick }) => (
  <MenubarItem onClick={handleCreateNewClick}>新規作成</MenubarItem>
);

export default memo(CreateNew);
