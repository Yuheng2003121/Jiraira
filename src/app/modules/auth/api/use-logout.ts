import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<
    InferResponseType<(typeof client.api.auth.logout)["$post"]>,
    Error
  >({
    mutationFn: async () => {
      const res = await client.api.auth.logout.$post();
      return await res.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });

  return mutation;
};
