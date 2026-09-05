import { User } from "./user";

export type Document = {
  id: number;
  title: string;
  content: string;
  members: User[];
};
