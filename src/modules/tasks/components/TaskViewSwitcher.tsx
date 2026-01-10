"use client";
import DottedSeparator from "@/components/DottedSeparator";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTaskModalOpen } from "@/store/useCreateTaskModalOpen";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useGetTasks } from "../api/use-get-tasks";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import DataFilters from "@/components/DataFilters";
import { useTaskFilter } from "@/hooks/useTaskFilter";
import { DataTable } from "@/components/ui/date-table";
import { columns } from "./Columns";

export default function TaskViewSwitcher() {
  const { workspaceId, projectId } = useParams();
  const [{ status, assigneeId, dueDate, projectId:searchProjectId }] = useTaskFilter();
  const { data: tasks, isPending: isPendingTasks } = useGetTasks({
    workspaceId: workspaceId as string,
    status,
    // projectId: searchProjectId ? searchProjectId : projectId as string,
    projectId: searchProjectId,
    assigneeId,
    dueDate,
  });
  const setIsOpen = useCreateTaskModalOpen((state) => state.setIsOpen);
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row gap-2  items-center">
          <TabsList className="w-full lg:w-fit gap-2">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full lg:w-fit lg:ml-auto cursor-pointer"
            size={"sm"}
            onClick={() => setIsOpen(true)}
          >
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isPendingTasks && (
          <div className="h-50">
            <Loader />
          </div>
        )}
        <>
          <TabsContent value="table" className="">
            <DataTable columns={columns} data={tasks || []}/>
          </TabsContent>
          <TabsContent value="kanban" className="">
            {JSON.stringify(tasks)}
          </TabsContent>
          <TabsContent value="calender" className="">
            {JSON.stringify(tasks)}
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}
