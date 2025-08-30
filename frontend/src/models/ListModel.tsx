import { Media } from "./MediaModel";

export interface UserList {
  id: number;
  userId: number;
  name: string;
  description?: string;
  items: Media[];
  isDefault: boolean;
  isPublic?: boolean;
  createdAt?: string;
}