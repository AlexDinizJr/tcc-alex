import { MediaType } from "./MediaType";

export interface Media {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number;
  type: MediaType;
  genres?: string[];
  links?: {
    service: string;
    url: string;
  }[];  
  // Campos específicos por tipo de mídia
  artists?: string[] | string; 
  directors?: string[];
  platforms?: string[];
  streaming?: string[];
  authors?: string[];
  seasons?: number;
  duration?: number;
  pages?: number;
  publisher?: string;
}