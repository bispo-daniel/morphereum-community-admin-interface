import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

import { customFetch } from "@/providers/auth";

export const ArtSchema = z.object({
  _id: z.string(),
  creator: z.string(),
  description: z.string(),
  name: z.string(),
  url: z.string(),
  xProfile: z.string(),
  approved: z.boolean(),
});

export type Art = z.infer<typeof ArtSchema>;

export const ArtsSchema = z.object({
  arts: z.array(ArtSchema),
  page: z.number(),
  next: z.boolean(),
});

export type Arts = z.infer<typeof ArtsSchema>;

const getArts = async ({ pageParam = 1 }) => {
  const response = await customFetch({
    endpoint: `/arts?page=${pageParam}`,
    options: {
      method: "GET",
    },
  });
  const data = (await response.json()) as Arts;

  return ArtsSchema.parse(data);
};

export const useArts = () =>
  useInfiniteQuery({
    queryKey: ["arts"],
    queryFn: getArts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.page + 1 : undefined,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
