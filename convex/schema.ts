import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  votes: defineTable({
    name: v.string(),
    nameLower: v.string(), // lowercased for uniqueness check
    guess: v.union(v.literal("boy"), v.literal("girl")),
    createdAt: v.number(),
  }).index("by_nameLower", ["nameLower"]),
});
