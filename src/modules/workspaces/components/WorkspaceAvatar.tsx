import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import React from "react";

interface WorksapceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}
export default function WorkspaceAvatar({
  image,
  name,
  className,
}: WorksapceAvatarProps) {
  if (image) {
    return (
      <div className={cn("size-10 relative rounded-md overflow-hidden")}>
        <Image src={image} alt={name} fill className="object-cover " />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="size-10 text-white bg-blue-600 font-semibold text-lg uppercase rounded-md flex items-center justify-center">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
