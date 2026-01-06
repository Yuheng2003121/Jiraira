import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.members)["$get"], 201>;

type RequestType = InferRequestType<(typeof client.api.members)["$get"]>;

interface UserGetMemberProps {
  workspaceId: string;
}
export const useGetMembers = ({ workspaceId }: UserGetMemberProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to get members");
      }

      return data as ResponseType;
    },
  });

  return query;
};
