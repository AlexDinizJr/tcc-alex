import { MediaType } from "./MediaType";
import { MediaGenre } from "./GenreModel";
import { ClassificationRating } from "./ClassificationRating";

export interface Media {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number;
  type: MediaType;
  classification?: ClassificationRating;
  genres?: MediaGenre[];
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