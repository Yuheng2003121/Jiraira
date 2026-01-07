"use client";

import DottedSeparator from "@/components/DottedSeparator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { Fragment } from "react";
import { useGetMembers } from "../api/use-get-members";
import Loader from "@/components/Loader";
import MemberAvatar from "./MemberAvatar";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { MemberRole } from "../types";

export default function MemberListView() {
  const { workspaceId } = useParams();
  const { data: members, isPending:isMmembersPending } = useGetMembers({
    workspaceId: workspaceId as string,
  });
  const {mutate:removeMember, isPending:isRemoveMemberPending} = useDeleteMember();
  const {mutate:updateMember, isPending:isUpdateMemberPending} = useUpdateMember();
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirm("Delete Member", "Are you sure to delete this memebr?", "destructive")
  const handleRemoveMember = async (memberId: string) => {
    const isDelete = await confirm();
    if (!isDelete) return;
    removeMember({
      param: {memberId}
    }, {
      onSuccess: () => {
        toast.success("Member removed successfully");
        queryClient.invalidateQueries({queryKey: ['members']});
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
     
  };

  const handleUpdateMember = async (memberId: string, role: MemberRole) => {
    updateMember(
      {
        param: { memberId },
        json: { role },
      },
      {
        onSuccess: () => {
          toast.success("Member updated successfully");
          queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }



  if (isMmembersPending || !members) {
    return <Loader />;
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Members</CardTitle>
      </CardHeader>
      <DottedSeparator />
      <CardContent>
        <ConfirmDialog />
        {members?.documents.length && !isMmembersPending ? (
          members?.documents.map((member) => (
            <Fragment key={member.$id}>
              <div
                className={cn(
                  "flex items-center justify-between py-4 border-b",
                  "last:border-b-0"
                )}
              >
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    name={member.name}
                    className="size-10"
                    fallbackClassName="text-lg size-10"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"secondary"} size={"icon"}>
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="center">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.ADMIN)
                        }
                        disabled={
                          isRemoveMemberPending || isUpdateMemberPending
                        }
                      >
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.MEMBER)
                        }
                        disabled={
                          isRemoveMemberPending || isUpdateMemberPending
                        }
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium text-amber-700 cursor-pointer"
                        onClick={() => handleRemoveMember(member.$id)}
                        disabled={
                          isRemoveMemberPending || isUpdateMemberPending
                        }
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Fragment>
          ))
        ) : (
          <div className="text-center">No members found</div>
        )}
      </CardContent>
    </Card>
  );
}
