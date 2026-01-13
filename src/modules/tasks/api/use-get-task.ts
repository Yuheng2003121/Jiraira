import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$get"],
  201
>;

// type RequestType = InferRequestType<(typeof client.api.projects)["$get"]>;

interface UserGetTasksProps {
  taskId: string;
}
export const useGetTask = ({ taskId }: UserGetTasksProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to get task");
      }

      return data as ResponseType;
    },
  });

  return query;
};
