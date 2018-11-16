import { User } from "./user.model";

export interface Applicant extends User {
  phoneNumber: string;
  experience: number;
  education: string;
  educationType: string;
}
