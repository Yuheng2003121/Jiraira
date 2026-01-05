import { client } from "@/lib/rpc"
import { useQuery } from "@tanstack/react-query"

export const useGetWorkspaceById = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => { 
      const response = await client.api.workspaces[":workspaceId"]["$get"]({param: {workspaceId}});
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error("Failed to fetch workspace ", error);
      }

      return await response.json()
    },
  })

  return query;
}