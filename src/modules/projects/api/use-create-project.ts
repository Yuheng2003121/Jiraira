import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"], 201>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({form}) => {
      const res = await client.api.projects.$post({ form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      return data as ResponseType;
    },
  });

  return mutation;
};
