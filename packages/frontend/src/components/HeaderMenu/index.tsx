import { Menubar } from "../ui/menubar";
import RuleName from "./RuleName";
import Menu from "./Menu";
import Help from "./Help";

export const HeaderMenu = () => (
  <Menubar className="bg-white justify-between">
    <div className="flex">
      <Menu />
      <Help />
    </div>
    <RuleName />
  </Menubar>
);
