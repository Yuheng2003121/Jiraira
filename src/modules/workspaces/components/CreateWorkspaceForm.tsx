"use client";

import React, { useRef } from "react";
import z from "zod";
import { createWorkspaceSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkspace } from "../api/use-create-workspace";
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
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}
export default function CreateWorkspaceForm({
  onCancel,
}: CreateWorkspaceFormProps) {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });


  const queryClient = useQueryClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    // console.log(values);
    values = {
      ...values,
      image: values.image instanceof File ? values.image : ""
    }

    createWorkspace(values, {
      onSuccess: (data) => {
        toast.success("Workspace created successfully");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        form.reset();

        onCancel?.();//关闭create workspace modal
        router.push(`/workspaces/${data.$id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  return (
    <Card className="border-0 shadow-none w-full py-4 ">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Create a new workspace
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
                  <FormLabel className="flex items-center gap-5" onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.click();
                  }}>
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
                      disabled={isPending}
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
                  "cursor-pointer",
                  //if onCancel is not provided, that means it is not a modal but in a page
                  !onCancel && "invisible"
                )}
                type="button"
                variant={"secondary"}
                size={"lg"}
                disabled={isPending}
                onClick={() => onCancel?.()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                size={"lg"}
                disabled={isPending}
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
