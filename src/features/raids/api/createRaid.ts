import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

import { Raid } from "./getRaids";

const registerRaid = async (raid: Omit<Raid, "_id">) => {
  const response = await customFetch({
    endpoint: `/raids`,
    options: {
      method: "POST",
      body: JSON.stringify(raid),
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao criar novo Raid.");
  }
};

export const useRegisterRaid = () => {
  return useMutation({
    mutationFn: (raid: Omit<Raid, "_id">) => registerRaid(raid),
  });
};
