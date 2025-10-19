import classNames from "classnames";
import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigator = () => {
  const location = useLocation().pathname;

  return (
    <nav className="flex items-center justify-between w-full p-4 px-8 border-b select-none">
      <Shield />

      <div className="flex gap-4">
        <Link
          to="/raids"
          className={classNames({
            "text-sm hover:underline": true,
            "text-[var(--coin-pink)]": location === "/raids",
          })}
        >
          Raids
        </Link>
        <Link
          to="/links"
          className={classNames({
            "text-sm hover:underline": true,
            "text-[var(--coin-pink)]": location === "/links",
          })}
        >
          Links
        </Link>
        <Link
          to="/arts"
          className={classNames({
            "text-sm hover:underline": true,
            "text-[var(--coin-pink)]": location === "/arts",
          })}
        >
          Arts
        </Link>
      </div>
    </nav>
  );
};

export default Navigator;
