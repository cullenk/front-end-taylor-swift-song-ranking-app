import { TopThirteenItem } from "./Top13Item";

export interface User {
    _id?: string;  // MongoDB ObjectId
    username: string;
    password: string;  // Note: Be cautious about handling passwords in the frontend
    topThirteen: TopThirteenItem[];
  }