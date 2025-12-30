
import { GoogleGenAI } from "@google/genai";
import { Message, GroundingChunk, RoofMetrics } from "../types";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async queryRoofAnalysis(
    address: string, 
    location: { lat: number | null; lng: number | null }
  ): Promise<{ text: string; chunks: GroundingChunk[]; metrics?: RoofMetrics }> {
    const model = "gemini-2.5-flash"; 
    
    const systemInstruction = `You are a Professional Satellite Roof Estimator, functioning similarly to EagleView or RoofSnap. 
    Your ONLY purpose is to provide highly accurate, truthful roof measurement reports for roofing contractors.
    
    TASK PROTOCOL:
    1. Resolve the address to high-resolution satellite imagery using the googleMaps tool.
    2. Analyze the roof geometry: identify ridges, valleys, eaves, and rakes.
    3. Calculate total square footage by estimating the 2D footprint and applying a slope factor based on identified pitch.
    4. Squares = Total Sq Ft / 100.
    5. Waste Factors: Provide totals for 10% and 15% overages.
    
    OUTPUT FORMAT:
    Start with a professional summary of the property.
    End with a technical metrics block:
    
    REPORT_DATA_START
    {
      "totalAreaSqFt": [number],
      "squares": [number],
      "primaryPitch": "[e.g. 8/12]",
      "ridgesLengthFt": [number],
      "valleysLengthFt": [number],
      "eavesLengthFt": [number],
      "rakesLengthFt": [number],
      "facetsCount": [number],
      "waste10Percent": [number],
      "waste15Percent": [number],
      "confidenceScore": [number 0-100]
    }
    REPORT_DATA_END
    
    Be precise. If data is obscured by trees, state it in your narrative. Truthfulness is paramount.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
      systemInstruction,
    };

    if (location.lat !== null && location.lng !== null) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: location.lat, longitude: location.lng }
        }
      };
    }

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: `Generate a Comprehensive Roof Measurement Report for: ${address}. Analyze structure scale and provide precision linear footages.`,
        config,
      });

      const fullText = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      let metrics: RoofMetrics | undefined;
      const metricsMatch = fullText.match(/REPORT_DATA_START\s*({[\s\S]*?})\s*REPORT_DATA_END/);
      if (metricsMatch) {
        try {
          metrics = JSON.parse(metricsMatch[1]);
        } catch (e) {
          console.error("Metric Parse Error", e);
        }
      }

      const cleanText = fullText.replace(/REPORT_DATA_START[\s\S]*?REPORT_DATA_END/, "").trim();
      return { text: cleanText, chunks, metrics };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
