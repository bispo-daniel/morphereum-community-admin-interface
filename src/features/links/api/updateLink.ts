import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

import { Link, LinkSchema } from "./getLinks";

const updateLink = async (link: Link) => {
  const { _id, ...updatedLink } = LinkSchema.parse(link);

  const response = await customFetch({
    endpoint: `/links/${_id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(updatedLink),
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar Link.");
  }
};

export const useUpdateLink = () => {
  return useMutation({
    mutationFn: (link: Link) => updateLink(link),
  });
};
