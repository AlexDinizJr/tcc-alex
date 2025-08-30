import { Review } from "../models/ReviewModel";

export const MOCK_REVIEWS: Review[] =
[
  { 
    id: 1, 
    mediaId: 1, 
    userId: 1,
    rating: 5, 
    comment: "Obra prima! Narrativa emocionante e jogabilidade excelente.", 
    date: "2023-08-15T16:20:00Z" 
  },
  { 
    id: 2, 
    mediaId: 3,
    userId: 1, 
    rating: 4, 
    comment: "Filme incrível, Christopher Nolan é um gênio", 
    date: "2023-07-10T11:45:00Z" 
  },
  { 
    id: 3, 
    mediaId: 6,
    userId: 2,
    rating: 5, 
    comment: "Obra atemporal da fantasia", 
    date: "2023-06-05T09:30:00Z" 
  },
];
