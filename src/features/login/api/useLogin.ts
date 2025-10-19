import { useMutation } from "@tanstack/react-query";

import env from "@/config";

const fetchLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(env.VITE_API_URL + "/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  const json = await response.json();

  return json as { token: string };
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => fetchLogin({ email, password }),
  });
};
