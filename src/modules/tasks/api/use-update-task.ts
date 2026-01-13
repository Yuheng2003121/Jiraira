import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$patch"], 201>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param, json}) => {
      const res = await client.api.tasks[":taskId"]["$patch"]({ json, param });
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
