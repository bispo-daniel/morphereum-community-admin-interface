import { useMutation } from "@tanstack/react-query";

import { customFetch } from "@/providers/auth";

import { type Link } from "./getLinks";

const registerLink = async (link: Omit<Link, "_id">) => {
  const response = await customFetch({
    endpoint: `/links`,
    options: {
      method: "POST",
      body: JSON.stringify(link),
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao criar novo Link.");
  }
};

export const useRegisterLink = () => {
  return useMutation({
    mutationFn: (link: Omit<Link, "_id">) => registerLink(link),
  });
};
