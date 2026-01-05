"use client"
import { cn } from '@/lib/utils';
import { SettingsIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react'
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go"

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <ul className='flex flex-col gap-2'>
      {routes.map((route) => {
        const fullPath = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullPath;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link href={fullPath} key={route.label}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-netural-500 hover:opacity-60 ",
                isActive && "bg-white shadow-sm  text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </div>
          </Link>
        );
      })}
      
    </ul>
  )
}
