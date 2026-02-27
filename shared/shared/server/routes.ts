import type { Server } from "http";
import type { Express } from "express";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/workshop/results", async (req, res) => {
    // 1. Obtener lista completa (Promesa)
    const listRes = await fetch("https://www.dnd5eapi.co/api/monsters");
    const listData = await listRes.json();
    
    // 2. Cargar detalles de los primeros 40 de forma concurrente (Promise.all)
    const first40 = listData.results.slice(0, 40);
    const detailsPromises = first40.map((m: any) => 
      fetch(`https://www.dnd5eapi.co${m.url}`).then(r => r.json())
    );
    const rawMonsters = await Promise.all(detailsPromises);

    // PARTE A: Normalización con .map()
    const partA = rawMonsters.map((m: any) => ({
      index: m.index,
      name: m.name,
      cr: m.challenge_rating || 0,
      hp: m.hit_points || 0,
      type: m.type,
      // ... (normalización de AC, Speed y Stats)
    }));

    // PARTE B: Consultas con filter, find, some, every y reduce
    const filterResult = partA.filter(m => m.cr >= 5 && m.hp >= 80);
    const findResult = partA.find(m => m.type === "dragon" && m.cr >= 6) || null;
    const someResult = partA.some((m: any) => m.hasLegendary);
    const everyResult = partA.every(m => m.hp > 0);

    // Agrupación por tipo con .reduce()
    const reduce1Result = partA.reduce((acc: any, m: any) => {
      if (!acc[m.type]) acc[m.type] = { count: 0, sumCR: 0, maxHP: 0 };
      acc[m.type].count++;
      acc[m.type].sumCR += m.cr;
      acc[m.type].maxHP = Math.max(acc[m.type].maxHP, m.hp);
      return acc;
    }, {});

    res.json({ partA, partB: { filterResult, findResult, someResult, everyResult, reduce1Result } });
  });

  return httpServer;
}