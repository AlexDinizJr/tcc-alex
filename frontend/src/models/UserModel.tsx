import  { UserList } from "./ListModel";
import { Review } from "./ReviewModel";

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  username: string;
  avatar?: string;
  createdAt?: Date;
  coverImage?: string;
  bio?: string;
  //dados mais complexos
  savedMedia?: number[];
  favorites?: number[];
  lists?: UserList[];
  reviews?: Review[];
  privacy: {
    profileVisibility: "public" | "private" ;
    showActivity: boolean;
    showSavedItems: boolean;
    showFavorites: boolean;
    showReviews: boolean;
    showStats: boolean;
    dataCollection: boolean;
  };
}