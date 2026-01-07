import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.projects)["$get"], 201>;

// type RequestType = InferRequestType<(typeof client.api.projects)["$get"]>;

interface UserGetMemberProps {
  workspaceId: string;
}
export const useGetProjects = ({ workspaceId }: UserGetMemberProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to get projects");
      }

      return data as ResponseType;
    },
  });

  return query;
};
