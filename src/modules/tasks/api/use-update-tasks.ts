import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.tasks)["bulk-update"]["$post"], 201>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useUpdateTasks = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json}) => {
      const res = await client.api.tasks["bulk-update"]["$post"]({
        json,
      });
      const data = await res.json();
      if (!res.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to update task");
      }

      return data as ResponseType;
    },
  });

  return mutation;
};
