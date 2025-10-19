import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

const deleteLink = async (linkId: string) => {
  const response = await customFetch({
    endpoint: `/links/${linkId}`,
    options: {
      method: "DELETE",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao remover Link.");
  }
};

export const useDeleteLink = () => {
  return useMutation({
    mutationFn: (linkId: string) => deleteLink(linkId),
  });
};
