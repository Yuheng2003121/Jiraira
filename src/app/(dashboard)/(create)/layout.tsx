import NavbarLogo from "@/components/NavbarLogo";
import React from "react";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-100 min-h-screen ">
      <div className="container mx-auto">
        <NavbarLogo/>
      </div>
      <div className="container mx-auto my-8">{children}</div>
    </div>
  );
}
