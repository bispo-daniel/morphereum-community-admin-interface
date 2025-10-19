import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { customFetch } from "@/providers/auth";

export const LinkSchema = z.object({
  _id: z.string().nonempty(),
  label: z.string().nonempty(),
  url: z.string().nonempty(),
  icon: z.string().nonempty(),
  type: z.enum(["community-links", "official-links"]),
});

export type Link = z.infer<typeof LinkSchema>;

export type Links = Link[];

const getLinks = async () => {
  const response = await customFetch({
    endpoint: "/links",
    options: { method: "GET" },
  });

  const data = await response.json();

  return data as Links;
};

export const useLinks = () =>
  useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
