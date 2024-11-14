import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button className="m-2 mt-4 p-2 bg-zinc-900" onClick={onClick}>
      {children}
    </button>
  );
}
