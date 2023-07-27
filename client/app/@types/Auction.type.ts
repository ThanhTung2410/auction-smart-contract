import { Item } from "./Item.type";
import { User } from "./User.type";

export interface Auction {
  auction_id: number;
  host_id: string;
  created_at: number;
  closed_at: number;
  floor_price: number;
  winner: string;
  highest_bid: number;
  users_join_auction: User[];
  item_id: number;
  item_metadata: Item;
}
