import { z } from "zod";

// Estructura de estadísticas base
export const statsSchema = z.object({
  str: z.number(),
  dex: z.number(),
  con: z.number(),
  int: z.number(),
  wis: z.number(),
  cha: z.number(),
});

// Estructura del monstruo normalizado (Parte A)
export const monsterSchema = z.object({
  index: z.string(),
  name: z.string(),
  size: z.string(),
  type: z.string(),
  alignment: z.string(),
  cr: z.number(),
  ac: z.number(),
  hp: z.number(),
  speed: z.number(),
  stats: statsSchema,
  immuneCount: z.number(),
  resistCount: z.number(),
  vulnCount: z.number(),
  hasLegendary: z.boolean(),
});

export type Monster = z.infer<typeof monsterSchema>;

// Estructura para los resultados de las consultas (Parte B)
export const workshopResultsSchema = z.object({
  partA: z.array(monsterSchema),
  partB: z.object({
    filterResult: z.array(monsterSchema),
    findResult: monsterSchema.nullable(),
    someResult: z.boolean(),
    everyResult: z.boolean(),
    reduce1Result: z.record(z.string(), z.object({
      count: z.number(),
      avgCR: z.number(),
      maxHP: z.number(),
    })),
    reduce2Result: z.record(z.string(), z.number()),
  })
});