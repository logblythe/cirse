import classNames from "clsx";
import { Menu } from "lucide-react";
import { EventSelector } from "./EventSelector";

type Props = {
  onMenuButtonClick(): void;
};

const Navbar = (props: Props) => {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true, // colors
        "flex items-center": true, // layout
        "w-screen md:w-full sticky z-10 px-8 shadow-sm h-[73px] top-0 ": true, //positioning & styling
      })}
    >
      <p className="font-bold text-xs md:text-sm">Custom Value Assigner</p>
      <div className="flex-grow"></div>
      <EventSelector />
      <button className="md:hidden ml-4" onClick={props.onMenuButtonClick}>
        <Menu className="h-6 w-6" />
      </button>
    </nav>
  );
};

export default Navbar;
