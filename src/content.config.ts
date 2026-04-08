import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stack = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stack" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    items: z.array(z.string()),
  }),
});

export const collections = { stack };
