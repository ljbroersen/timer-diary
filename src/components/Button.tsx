import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      className="p-3 bg-emerald-800 cursor-pointer hover:bg-emerald-900"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
