
export interface JobPosting {
    id?: number;
    jobTitle?: string;
    jobType?: string;
    dateFrom?: string;
    dateTo?: string;
    description?: string;
    education?: string;
    status?: string;
    experience?: number;
    companyId?: number;
    companyName?: string;
    companyEmail?: string;
    companyLocation?: string;
    allApplicationsCount?: number;
    activeApplicationsCount?: number;
    applicantName?: string;
}
