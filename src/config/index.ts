import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().nonempty(),
});

const env = envSchema.parse(import.meta.env);

export default env;
