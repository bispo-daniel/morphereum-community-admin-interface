import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

const deleteRaid = async (raidId: string) => {
  const response = await customFetch({
    endpoint: `/raids/${raidId}`,
    options: {
      method: "DELETE",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao remover Raid.");
  }
};

export const useDeleteRaid = () => {
  return useMutation({
    mutationFn: (raidId: string) => deleteRaid(raidId),
  });
};
