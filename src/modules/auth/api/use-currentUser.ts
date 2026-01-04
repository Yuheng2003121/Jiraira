import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await client.api.auth.current.$get();
      if (!res.ok) {
        return null;
      }

      const { data } = await res.json();

      return await data;
    },
  });

  return query;
};
