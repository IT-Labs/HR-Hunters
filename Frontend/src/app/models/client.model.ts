import { User } from "./user.model";

export interface Client extends User {
  phoneNumber: string;
}
