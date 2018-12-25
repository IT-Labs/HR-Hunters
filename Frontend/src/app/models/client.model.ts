import { User } from "./user.model";

export interface Client extends User {
  companyName: string,
  logo?: string,
  activeJobs?: number,
  allJobs?: number,
  status?: string,
  location?: string,
  phoneNumber?: string
}