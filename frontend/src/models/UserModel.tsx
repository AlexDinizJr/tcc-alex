import  { UserList } from "./ListModel";

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;

  savedMedia?: number[];
  lists?: UserList[];
  reviewIds?: number[];
  favorites?: number[];
}