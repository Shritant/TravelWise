import { users, recommendations, type User, type InsertUser, type Recommendation, type InsertRecommendation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  getAllRecommendations(): Promise<Recommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recommendations: Map<number, Recommendation>;
  private currentUserId: number;
  private currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.recommendations = new Map();
    this.currentUserId = 1;
    this.currentRecommendationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: Recommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date().toISOString(),
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }

  async getAllRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values());
  }
}

export const storage = new MemStorage();
