import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param, json}) => {
      const res = await client.api.members[":memberId"]["$patch"]({
        param,
        json
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error || "Failed to update current member");
      }
      const data = await res.json();

      return data;
    },
  });

  return mutation;
};
