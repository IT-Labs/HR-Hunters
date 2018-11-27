
export interface JobPosting {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string;
    jobType: string;
    dateFrom: Date;
    dateTo: Date;
    applications: number;
    description: string;
    education: string;
    status: string;
    experience: number;
}
