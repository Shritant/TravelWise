import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createRecommendationSchema, type CreateRecommendation, type RecommendationResponse } from "@shared/schema";
import { generateRecommendations } from "./openai";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common file types for email attachments
    const allowedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PDF, TXT, PNG, or JPG files.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and parse itinerary file
  app.post("/api/upload-itinerary", upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // For demo purposes, we'll extract text from the buffer
      // In a real app, you'd use libraries like pdf-parse for PDFs
      const extractedText = req.file.buffer.toString('utf-8');
      
      res.json({ 
        success: true, 
        text: extractedText,
        filename: req.file.originalname 
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: "Failed to process file upload" });
    }
  });

  // Generate AI recommendations
  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const validatedData = createRecommendationSchema.parse(req.body);
      
      // Generate recommendations using OpenAI
      const recommendations = await generateRecommendations(validatedData);
      
      // Save to storage
      const savedRecommendation = await storage.saveRecommendation({
        itineraryText: validatedData.itineraryText,
        interests: validatedData.interests,
        leisureTime: validatedData.leisureTime || null,
        recommendations: recommendations as any,
      });

      res.json({
        success: true,
        id: savedRecommendation.id,
        recommendations
      });
    } catch (error) {
      console.error('Recommendation generation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to generate recommendations" });
      }
    }
  });

  // Get saved recommendation
  app.get("/api/recommendations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const recommendation = await storage.getRecommendation(id);
      
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }

      res.json(recommendation);
    } catch (error) {
      console.error('Get recommendation error:', error);
      res.status(500).json({ message: "Failed to retrieve recommendation" });
    }
  });

  // Get all recommendations
  app.get("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const recommendations = await storage.getAllRecommendations();
      res.json(recommendations);
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ message: "Failed to retrieve recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
