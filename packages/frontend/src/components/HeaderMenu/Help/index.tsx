import { useCallback } from "react";
import Help from "./Help";
import { MenubarMenu } from "../../ui/menubar";

const MenuHelp = () => {
  /**
   * The Help event.
   */
  const handleHelpClick = useCallback(() => {
    window.open(import.meta.env.VITE_HELP_LINK_URL);
  }, [import.meta.env.VITE_HELP_LINK_URL]);

  return (
    <MenubarMenu>
      <Help handleHelpClick={handleHelpClick} />
    </MenubarMenu>
  );
};

export default MenuHelp;
