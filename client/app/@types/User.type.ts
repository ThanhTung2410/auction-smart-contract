import { Item } from "./Item.type";

export interface User {
  user_id: string;
  // name: string;
  // avatar: string;
  // email: string;
  // phone: string;
  // description: string;
  items: Item[];
}
