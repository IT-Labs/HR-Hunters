
export interface JobPosting {
    id: number;
    jobTitle: string;
    jobType: string;
    dateFrom: Date;
    dateTo: Date;
    description: string;
    education: string;
    status: string;
    experience: number;
    companyName: string;
    companyEmail: string;
    location: string;
    logo: string;
    allApplicationsCount?: number;
    activeApplicationsCount?: number;
    applicantName?: string;
}
