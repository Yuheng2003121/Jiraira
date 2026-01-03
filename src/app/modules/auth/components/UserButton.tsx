"use client";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useCurrentUser } from "../api/use-currentUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogInIcon } from "lucide-react";
import { useLogout } from "../api/use-logout";

export default function UserButton() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();
  if (isLoading || !user) {
    return (
      <Skeleton className="size-10 rounded-full flex items-center justify-center bg-neutral-200 ">
        {/* <Loader className="size-4 animate-spin text-muted-foreground" /> */}
      </Skeleton>
    );
  }
  const { name, email } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "U";



  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75  transition border border-neutral-300 cursor-pointer">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={10} >
        <div className="flex flex-col items-center justify-center gap-2 px-10 py-4">
          <Avatar className="size-10 border border-neutral-300 cursor-pointer">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem 
            className="flex items-center justify-center cursor-pointer font-medium py-2 hover:bg-neutral-100 transition-colors"
            onClick={() => logout()}
          >
          <LogInIcon className="size-4"/>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
