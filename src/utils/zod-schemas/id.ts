import { z } from "zod";

export const numberId = z.object({
  id: z.preprocess(
    (s: string) => parseInt(s),
    z.number("Id is required and must be a number"),
  ),
});

export const stringId = z.object({
  id: z.string("Id is required and must be a string"),
});
