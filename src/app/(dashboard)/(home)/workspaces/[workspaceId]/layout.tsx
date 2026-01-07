import NavbarLogo from "@/components/NavbarLogo";
import React from "react";

export default function WorkspaceIdlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <NavbarLogo />
      <div className="flex-1 w-full py-10 px-6">
        {children}
      </div>
    </div>
  );
}
