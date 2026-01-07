import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"], 201
>;

type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });

      const data = await res.json();
      if (!res.ok) {
        const error = data as { error: string };
        throw new Error(error.error || "Failed to update project");
      }

      return data as ResponseType;
    },
  });

  return mutation;
};
