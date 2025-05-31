import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  itineraryText: text("itinerary_text").notNull(),
  interests: text("interests").array().notNull(),
  leisureTime: jsonb("leisure_time"),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const createRecommendationSchema = z.object({
  itineraryText: z.string().min(10, "Itinerary must be at least 10 characters"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  leisureTime: z.object({
    dailyHours: z.string().optional(),
    preferredTime: z.string().optional(),
    travelStyle: z.string().optional(),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type CreateRecommendation = z.infer<typeof createRecommendationSchema>;

export interface RecommendationResponse {
  mustVisitPlaces: Array<{
    name: string;
    description: string;
    duration: string;
    rating: number;
    category: string;
  }>;
  personalizedRecommendations: {
    food: Array<{
      name: string;
      description: string;
      priceRange: string;
      matchReason: string;
      category: string;
    }>;
    culture: Array<{
      name: string;
      description: string;
      duration: string;
      matchReason: string;
      category: string;
    }>;
    nature: Array<{
      name: string;
      description: string;
      duration: string;
      matchReason: string;
      category: string;
    }>;
    shopping: Array<{
      name: string;
      description: string;
      duration: string;
      matchReason: string;
      category: string;
    }>;
  };
}
