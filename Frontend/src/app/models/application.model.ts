export interface Application {
  id: number;
  applicantFirstName?: string;
  applicantLastName?: string;
  applicantEmail?: string;
  jobTitle: string;
  jobType: string;
  experience?: string;
  postedOn?: string;
  dateFrom: string;
  dateTo: string;
  status?: string;
  description?: string;
}
