import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

const updateArt = async (artId: string) => {
  const approvedArt = { approved: true };

  const response = await customFetch({
    endpoint: `/arts/${artId}`,
    options: {
      method: "PUT",
      body: JSON.stringify(approvedArt),
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar Art.");
  }
};

export const useUpdateArt = () => {
  return useMutation({
    mutationFn: (artId: string) => updateArt(artId),
  });
};
