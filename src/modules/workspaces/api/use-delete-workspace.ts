import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete workspace");
      }
      const data = await res.json();

      return data;
    },
  });

  return mutation;
};
