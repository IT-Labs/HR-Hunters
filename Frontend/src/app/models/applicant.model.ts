import { User } from "./user.model";

export interface Applicant extends User {
  firstName: string;
  lastName: string;
  photo?: string;
  phoneNumber?: string;
  education?: string;
  school?: string;
  experience?: string;
}
