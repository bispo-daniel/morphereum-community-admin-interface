import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { customFetch } from "@/providers/auth";

export const RaidSchema = z.object({
  _id: z.string(),
  date: z.string(),
  platform: z.string(),
  url: z.string(),
  shareMessage: z.string(),
  content: z.string(),
});

export type Raid = z.infer<typeof RaidSchema>;

export type Raids = Raid[];

const getRaids = async () => {
  const response = await customFetch({
    endpoint: "/raids",
    options: { method: "GET" },
  });

  const data = await response.json();

  return data as Raids;
};

export const useRaids = () =>
  useQuery({
    queryKey: ["raids"],
    queryFn: getRaids,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
