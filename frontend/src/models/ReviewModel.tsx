export interface Review {
  id: number;
  mediaId: number;
  userId: number;
  user?: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  helpful?: number;
}

export type NewReview = Omit<Review, 'id' | 'date' | 'user' | 'avatar' | 'helpful' | 'userId'>;