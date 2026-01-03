import { client } from "@/lib/rpc"
import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"


export const useSignup = () => {
  const mutate = useMutation<
    InferResponseType<(typeof client.api.auth.register)["$post"]>,
    Error,
    InferRequestType<(typeof client.api.auth.register)["$post"]>["json"]
  >({
    mutationFn: async (json) => {
      const res = await client.api.auth.register.$post({ json });
      return await res.json();
    },
  });

  return mutate;
}