import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { TaskStatus } from "../types";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["$get"],
  201
>;

// type RequestType = InferRequestType<(typeof client.api.projects)["$get"]>;

interface UserGetTasksProps {
  workspaceId: string;
  projectId?:string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}
export const useGetTasks = ({ workspaceId, projectId, status, assigneeId, dueDate, search }: UserGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks", 
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId || undefined,
          status: status || undefined,
          assigneeId: assigneeId || undefined,
          dueDate: dueDate || undefined,
          search: search || undefined,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to get tasks");
      }

      return data as ResponseType;
    },
  });

  return query;
};
