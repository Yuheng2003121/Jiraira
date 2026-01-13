"use client";

import React, { useRef } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema } from "../schema";
import { DatePicker } from "@/components/DatePicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberAvatar from "@/modules/members/components/MemberAvatar";
import { TaskStatus } from "../types";
import ProjectAvatar from "@/modules/projects/components/ProjectAvatar";
import { useCreateTaskModalOpen } from "@/store/useCreateTaskModalOpen";
interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}
export default function CreateTaskForm({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) {
  const { mutate: createTask, isPending } = useCreateTask();
  const { workspaceId } = useParams();
  const setInitialStatus = useCreateTaskModalOpen(
    (state) => state.setInitialStatus
  );
  const initialStatus = useCreateTaskModalOpen((state) => state.initialStatus);
  // const omittedCreateTaskSchema = createTaskSchema.omit({ workspaceId: true });

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId: workspaceId as string,
      name: "",
      status: initialStatus || TaskStatus.TODO,
      projectId: "",
      assigneeId: "",
      dueDate: undefined,
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    // console.log(values);

    createTask(
      { json: { ...values, workspaceId: workspaceId as string } },
      {
        onSuccess: (data) => {
          toast.success("Task created successfully");
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          form.reset();

          onCancel?.(); //关闭create PROJECT modal
          // router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const onDateSelect = (date: Date) => {
    form.setValue("dueDate", date ? date.toISOString() : undefined);
  };

  return (
    <Card className="border-0 shadow-none w-full py-4 ">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create a new Task</CardTitle>
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
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Due Date</FormLabel>
                  <DatePicker onDateSelect={onDateSelect} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a assignee" />
                      </SelectTrigger>
                      <FormMessage />
                      <SelectContent position="popper" side="bottom">
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <MemberAvatar
                                name={member.name}
                                className="size-6"
                                fallbackClassName="size-6"
                              />
                              <span>{member.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a assignee" />
                      </SelectTrigger>
                      <FormMessage />
                      <SelectContent position="popper" side="bottom">
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a assignee" />
                      </SelectTrigger>
                      <FormMessage />
                      <SelectContent position="popper" side="bottom">
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <ProjectAvatar
                                name={project.name}
                                className="size-6"
                                image={project.imageUrl}
                              />
                              <span>{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
