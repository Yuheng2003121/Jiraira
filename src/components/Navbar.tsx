import UserButton from "@/modules/auth/components/UserButton";
import React from "react";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  return (
    <nav className="py-4 px-6 flex items-center justify-between border-b">
      <MobileSidebar />
      <div className="hidden lg:flex flex-col ">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">Monitor all of your projects</p>
      </div>
      <UserButton />
    </nav>
  );
}
