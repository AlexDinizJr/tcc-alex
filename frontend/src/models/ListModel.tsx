import { Media } from "./MediaModel";

export interface UserList {
  id: number;
  name: string;
  items: Media[];
  isDefault: boolean;
  isPublic?: boolean;
  createdAt?: string;
}