import  { UserList } from "./ListModel";
import { Review } from "./ReviewModel";

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
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
    showReviews: boolean;
    dataCollection: boolean;
  };
}