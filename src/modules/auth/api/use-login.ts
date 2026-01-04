import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    InferResponseType<(typeof client.api.auth.login)["$post"]>,
    Error,
    InferRequestType<(typeof client.api.auth.login)["$post"]>["json"]
  >({
    mutationFn: async (json) => {
      const res = await client.api.auth.login.$post({ json });
      if (!res.ok) {
        throw new Error("Failed to login");
      }
      const data = await res.json();

      return data;
    },
    
  });

  return mutation;
};
