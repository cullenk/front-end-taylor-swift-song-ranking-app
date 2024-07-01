import { TopThirteenItem } from "./Top13Item";

export interface User {
    _id?: string;  // MongoDB ObjectId
    username: string;
    password: string;
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    topThirteen: TopThirteenItem[];
  }