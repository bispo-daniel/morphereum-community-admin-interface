import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().nonempty(),
  VITE_ART_RECORDS_PER_PAGE: z.coerce.number().min(1).default(3),
});

const env = envSchema.parse(import.meta.env);

export default env;
