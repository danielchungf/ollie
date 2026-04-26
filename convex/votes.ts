import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("votes").order("desc").collect();
  },
});

export const tally = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("votes").collect();
    const boy = all.filter((v) => v.guess === "boy").length;
    const girl = all.filter((v) => v.guess === "girl").length;
    return { boy, girl, total: all.length };
  },
});

export const cast = mutation({
  args: {
    name: v.string(),
    guess: v.union(v.literal("boy"), v.literal("girl")),
  },
  handler: async (ctx, args) => {
    const trimmed = args.name.trim();
    if (trimmed.length === 0) {
      throw new Error("Se necesita un nombre.");
    }
    if (trimmed.length > 60) {
      throw new Error("El nombre no puede tener más de 60 caracteres.");
    }
    const nameLower = trimmed.toLowerCase();

    const existing = await ctx.db
      .query("votes")
      .withIndex("by_nameLower", (q) => q.eq("nameLower", nameLower))
      .first();

    if (existing) {
      throw new Error(
        `Parece que ${trimmed} ya apostó. Prueba con otro nombre (ej. "${trimmed} 2").`,
      );
    }

    await ctx.db.insert("votes", {
      name: trimmed,
      nameLower,
      guess: args.guess,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("votes"), secret: v.string() },
  handler: async (ctx, args) => {
    if (args.secret !== "verresultados") {
      throw new Error("No autorizado.");
    }
    await ctx.db.delete(args.id);
  },
});