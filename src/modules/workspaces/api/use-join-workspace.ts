import { error } from "console";
import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;

export const useJoinWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.workspaces[":workspaceId"]["join"]["$post"]({
        json,
        param,
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error || "Failed to join workspace");
      }
      const data = await res.json();

      return data;
    },
  });

  return mutation;
};
