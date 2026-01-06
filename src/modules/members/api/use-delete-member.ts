import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const res = await client.api.members[":memberId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error || "Failed to delete current member");
      }
      const data = await res.json();

      return data;
    },
  });

  return mutation;
};
