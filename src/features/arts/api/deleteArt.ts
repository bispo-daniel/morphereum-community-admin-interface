import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

const deleteArt = async (artId: string) => {
  const response = await customFetch({
    endpoint: `/arts/${artId}`,
    options: {
      method: "DELETE",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao remover Art.");
  }
};

export const useDeleteArt = () => {
  return useMutation({
    mutationFn: (artId: string) => deleteArt(artId),
  });
};
