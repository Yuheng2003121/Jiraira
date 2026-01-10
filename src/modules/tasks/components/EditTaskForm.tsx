"use client";

import React, { useEffect, useRef, useState } from "react";
import z from "zod";
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
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useConfirm from "@/hooks/use-confirm";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { updateProjectSchema } from "../schema";
import { Project } from "../types";
import Link from "next/link";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}
export default function EditProjectForm({
  onCancel,
  initialValues,
}: EditProjectFormProps) {
  const { mutate: updateProject, isPending: isUpdatePending } =
    useUpdateProject();
  const { mutate: deleteWorksapce, isPending: isDeletePending } =
    useDeleteProject();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: (initialValues as Project)?.imageUrl ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      ...initialValues,
      image: (initialValues as Project)?.imageUrl ?? "",
    });
  }, [initialValues, form]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    // console.log(values);
    values = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    updateProject(
      { form: values, param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          queryClient.invalidateQueries({
            queryKey: ["project", initialValues.$id],
          });
          form.reset();
          router.refresh();

          onCancel?.(); //关闭create project modal
          // router.push(`/workspaces/${data.$id}`);
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
    "Delete Project",
    "This action cannot be undone",
    "destructive"
  );

  const handleDelete = async () => {
    const confirm = await confirmDelete();

    if (!confirm) return;

    deleteWorksapce(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: (data) => {
          toast.success("Project deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          queryClient.invalidateQueries({
            queryKey: ["project", data.$id],
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

  return (
    <div className="flex flex-col gap-8">
      <DeleteDialog />
      <Card className="border  w-full py-4 ">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button className="w-fit " variant={"secondary"} size={"sm"} asChild>
              <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`}>
                <ArrowLeft />
                Back
              </Link>
            </Button>
            <CardTitle className="text-xl font-bold">
              {initialValues.name}
            </CardTitle>
          </div>
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

      {/* <Card className="border w-full py-4">
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
      </Card> */}

      <Card className="border  w-full py-4">
        <CardContent>
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a Project is permanent and cannot be undone.
            </p>
            <Button
              className="w-fit ml-auto mt-4"
              size="sm"
              variant={"destructive"}
              type="button"
              disabled={isUpdatePending || isDeletePending}
              onClick={() => handleDelete()}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
