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

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    projects: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        demo: z.string().nullable(),
        repo: z.string(),
        stack: z.array(z.string()),
        image: z.string().optional().or(z.literal("")),
      }),
    ),
  }),
});

export const collections = { stack, projects };
