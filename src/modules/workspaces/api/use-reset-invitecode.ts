import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInvitecode = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to reset invite code ");
      }
      const data = await res.json();

      return data;
    },
  });

  return mutation;
};
