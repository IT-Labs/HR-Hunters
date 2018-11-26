import { User } from "./user.model";

export interface Client extends User {
  companyName: string,
  logo?: string,
  activeJobs?: string,
  allJobs?: string,
  status?: string,
  location?: string
}
