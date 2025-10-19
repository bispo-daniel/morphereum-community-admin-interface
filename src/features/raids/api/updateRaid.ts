import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

import { Raid, RaidSchema } from "./getRaids";

const updateRaid = async (raid: Raid) => {
  const { _id, ...updatedRaid } = RaidSchema.parse(raid);

  const response = await customFetch({
    endpoint: `/raids/${_id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(updatedRaid),
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar Raid.");
  }
};

export const useUpdateRaid = () => {
  return useMutation({
    mutationFn: (raid: Raid) => updateRaid(raid),
  });
};
