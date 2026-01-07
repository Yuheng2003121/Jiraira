import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.projects)[":projectId"]["$get"], 201>;

// type RequestType = InferRequestType<(typeof client.api.projects)["$get"]>;

interface UserGetMemberProps {
  workspaceId: string;
  projectId: string;
}
export const useGetProjectById = ({ workspaceId, projectId }: UserGetMemberProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
        query: { workspaceId },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to get project");
      }

      return data as ResponseType;
    },
  });

  return query;
};
