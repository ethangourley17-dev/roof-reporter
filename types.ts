
export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: string[];
    }[];
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface RoofMetrics {
  totalAreaSqFt: number;
  squares: number; // 1 square = 100 sq ft
  primaryPitch: string;
  ridgesLengthFt: number;
  valleysLengthFt: number;
  eavesLengthFt: number;
  rakesLengthFt: number;
  facetsCount: number;
  waste10Percent: number;
  waste15Percent: number;
  confidenceScore: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  groundingLinks?: GroundingChunk[];
  timestamp: Date;
  metrics?: RoofMetrics;
  isReport?: boolean;
}

export interface AppState {
  location: {
    lat: number | null;
    lng: number | null;
  };
  isLoading: boolean;
  statusMessage: string;
  messages: Message[];
}
