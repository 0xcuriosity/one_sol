import { type ReactElement } from "react";

export const SidebarItem = ({
  startIcon,
  text,
  onClick,
  isActive = false,
}: {
  startIcon: ReactElement;
  text: string;
  onClick?: () => void;
  isActive: boolean;
}) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer
        transition-all duration-150 ease-in-out
        ${
          isActive
            ? "bg-slate-800 text-white shadow-md"
            : "text-gray-300 hover:bg-slate-900 hover:text-white"
        }
        hover:shadow-lg hover:scale-105
        group
      `}
      onClick={onClick}
    >
      <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
        {startIcon}
      </div>
      <span className="text-sm font-medium transition-colors duration-200">
        {text}
      </span>
    </div>
  );
};
