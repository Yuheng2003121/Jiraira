"use client";

import React, { useEffect, useRef, useState } from "react";
import z from "zod";
import { updateWorkspaceSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DottedSeparator from "@/components/DottedSeparator";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckIcon, CopyCheckIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Workspace } from "../types";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import useConfirm from "@/hooks/use-confirm";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useResetInvitecode } from "../api/use-reset-invitecode";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}
export default function EditWorkspaceForm({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) {
  const { mutate: updateWorkspace, isPending: isUpdatePending } =
    useUpdateWorkspace();
  const { mutate: deleteWorksapce, isPending: isDeletePending } =
    useDeleteWorkspace();

  const { mutate: resetInvitecode, isPending: isResetInvitecodePending } =
    useResetInvitecode();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: (initialValues as Workspace)?.imageUrl ?? "",
    },
  });

  

  const queryClient = useQueryClient();
  const router = useRouter();
  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    // console.log(values);
    values = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    updateWorkspace(
      { form: values, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (data) => {
          toast.success("Workspace updated successfully");
          queryClient.invalidateQueries({ queryKey: ["workspaces"] });
          queryClient.invalidateQueries({
            queryKey: ["workspaces", initialValues.$id],
          });
          form.reset();

          onCancel?.(); //关闭create workspace modal
          router.push(`/workspaces/${data.$id}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Worksapce",
    "This action cannot be undone",
    "destructive"
  );

  const handleDelete = async () => {
    const confirm = await confirmDelete();

    if (!confirm) return;

    deleteWorksapce(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (data) => {
          toast.success("Workspace deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["workspaces"] });
          queryClient.invalidateQueries({
            queryKey: ["workspaces", data.$id],
          });
          router.push("/");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteLink);
    toast.success("Copied to clipboard");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 6000);
  };

  const handleResetInviteCode = () => { 
    resetInvitecode({param: {workspaceId: initialValues.$id}}, {
      onSuccess: (data) => { 
        toast.success("Invite code reset successfully");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspace", data.$id],
        });

      },
      onError: (error) => { 
        toast.error(error.message);
      }
    })
  };

  return (
    <div className="flex flex-col gap-8">
      <DeleteDialog />
      <Card className="border  w-full py-4 ">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <DottedSeparator className="mb-1" />
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Workspace" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="flex items-center gap-5"
                      onClick={(e) => {
                        e.preventDefault();
                        inputRef.current?.click();
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center cursor-pointer size-18 relative overflow-hidden">
                          {field.value ? (
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              fill
                              alt="Logo"
                              className="object-cover"
                            />
                          ) : (
                            <Avatar className="size-18">
                              <AvatarFallback>
                                <ImageIcon className="size-9 text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">Workspace Icon</p>
                          <span className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 5mb
                          </span>
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleImageChange}
                        disabled={isUpdatePending || isDeletePending}
                        className="border-0 outline-0"
                        hidden
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Button
                  className={cn(
                    "cursor-pointer"
                    //if onCancel is not provided, that means it is not a modal but in a page
                    // !onCancel && "invisible"
                  )}
                  type="button"
                  variant={"secondary"}
                  size={"lg"}
                  disabled={isUpdatePending || isDeletePending}
                  onClick={() =>
                    onCancel
                      ? onCancel()
                      : router.push(`/workspaces/${initialValues.$id}`)
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  size={"lg"}
                  disabled={isUpdatePending || isDeletePending}
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border w-full py-4">
        <CardContent>
          <div className="flex flex-col">
            <h3 className="font-bold">Invite members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Input disabled value={fullInviteLink} />

              <CustomTooltip
                message={isCopied ? "Copied" : "Copy to clipboard"}
                onClick={handleCopy}
                className="size-12"
                variant={"secondary"}
              >
                {isCopied ? (
                  <CopyCheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </CustomTooltip>
            </div>
            <Button
              className="w-fit ml-auto mt-4"
              size="sm"
              variant={"destructive"}
              type="button"
              disabled={isUpdatePending || isDeletePending}
              onClick={() => handleResetInviteCode()}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border  w-full py-4">
        <CardContent>
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is permanent and cannot be undone.
            </p>
            <Button
              className="w-fit ml-auto mt-4"
              size="sm"
              variant={"destructive"}
              type="button"
              disabled={isUpdatePending || isDeletePending}
              onClick={() => handleDelete()}
            >
              Delete Worksapce
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
