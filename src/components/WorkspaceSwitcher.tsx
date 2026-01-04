"use client";

import { useGetWorkspaces } from "@/modules/workspaces/api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "@/modules/workspaces/components/WorkspaceAvatar";
import { useParams, useRouter } from "next/navigation";
import { useCreateModalOpen } from "@/store/useCreateModalOpen";

export default function WorkspaceSwitcher() {
  const { data: workspaces } = useGetWorkspaces();

  const router = useRouter();

  const { workspaceId } = useParams();
 const setIsOpen = useCreateModalOpen((state) => state.setIsOpen);
  const handleValueChange = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase text-neutral-500">
          Workspaces
        </p>
        <RiAddCircleFill
          className="size-6 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <Select onValueChange={handleValueChange} value={workspaceId as string}>
        <SelectTrigger className=" w-full border-0 font-medium p-2 cursor-pointer">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom">
          <SelectGroup>
            {!!workspaces?.total ? (
              workspaces?.documents.map((workspace) => (
                <SelectItem key={workspace.$id} value={workspace.$id}>
                  <div className="flex gap-4 items-center cursor-pointer">
                    <WorkspaceAvatar
                      name={workspace.name}
                      image={workspace.imageUrl}
                    />
                    <span className="text-sm font-semibold truncate flex-1 min-w-0">
                      {workspace.name}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No workspaces
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
