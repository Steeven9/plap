"use client";

import { ReactElement } from "react";

interface ButtonProps {
  icon?: ReactElement;
  label?: string;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  label,
  icon,
  tooltip,
  className,
  disabled = false,
  onClick,
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`${
        disabled ? "disabled" : "bg-blue-900 hover:bg-blue-800 cursor-pointer"
      } font-bold py-[10px] px-4 rounded inline-flex align-middle space-x-3 mr-2 my-2 ${
        className ?? ""
      }`}
      onClick={disabled ? () => {} : onClick}
      title={tooltip}
    >
      {icon}
      {label ? <span>{label}</span> : null}
    </button>
  );
}
