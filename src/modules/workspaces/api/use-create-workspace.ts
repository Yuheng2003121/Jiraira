import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useCreateWorkspace = () => {
  const mutation = useMutation<
    InferResponseType<(typeof client.api.workspaces)["$post"]>,
    Error,
    InferRequestType<(typeof client.api.workspaces)["$post"]>["form"]
  >({
    mutationFn: async (form) => {
      const res = await client.api.workspaces.$post({ form });
      if (!res.ok) {
        throw new Error("Failed to create workspace");
      }
      const data = await res.json();

      return data;
    },
    
  });

  return mutation;
};
