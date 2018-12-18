export interface Application {
  id: number;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  jobTitle: string;
  jobType: string;
  experience: number;
  postedOn: Date;
  dateFrom: Date;
  dateTo: Date;
  status: string;
  description: string;
}
