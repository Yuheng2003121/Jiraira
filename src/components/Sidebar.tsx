import Image from "next/image";
import Link from "next/link";
import React from "react";
import DottedSeparator from "./DottedSeparator";
import Navigation from "./Navigation";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import Projects from "@/modules/projects/components/Projects";

export default function Sidebar() {
  return (
    <aside className="flex flex-col h-full p-4 bg-neutral-100 overflow-y-auto">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src="/logo.svg" alt="Jira" height={38} width={38} />
        <h1 className="font-bold text-2xl">Jira</h1>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher/>
      <DottedSeparator className="my-4" />
      <Navigation/>
      <DottedSeparator className="my-4" />
      <Projects/>
    </aside>
  );
}
