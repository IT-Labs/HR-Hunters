import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class JobPostingService {
  baseUrl = environment.baseUrl;
  // Local list of job postings
  private jobPostings: JobPosting[] = [];

  // Observable watching when JobPosings get updated
  private jobPostingsUpdated = new Subject<{
    jobPostings: JobPosting[];
    jobPostingCount: number;
    approved: number;
    pending: number;
    expired: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Get all job postings
  getJobPostings(queryParams) {
    this.http
      .get<{
        jobPostings: any[];
        maxJobPosts: number;
        approved: number;
        pending: number;
        expired: number;
      }>(this.baseUrl + '/Admin/jobs' + queryParams)
      .pipe(
        map(jobPostingData => {
          return {
            jobPostings: jobPostingData.jobPostings.map(jobPost => {
              return {
                id: jobPost.id,
                jobTitle: jobPost.jobTitle,
                jobType: jobPost.jobType,
                dateFrom: jobPost.dateFrom,
                dateTo: jobPost.dateTo,
                description: jobPost.description,
                education: jobPost.education,
                status: jobPost.status,
                experience: jobPost.experience,
                companyName: jobPost.companyName,
                companyEmail: jobPost.companyEmail,
                location: jobPost.location,
                logo: jobPost.logo,
                allApplicationsCount: jobPost.allApplicationsCount,
                activeApplicationsCount: jobPost.activeApplicationsCount
              };
            }),
            maxJobPosts: jobPostingData.maxJobPosts,
            approved: jobPostingData.approved,
            pending: jobPostingData.pending,
            expired: jobPostingData.expired
          };
        })
      )
      .subscribe(transformedJobPostingData => {
        this.jobPostings = transformedJobPostingData.jobPostings;
        this.jobPostingsUpdated.next({
          jobPostings: this.jobPostings,
          jobPostingCount: transformedJobPostingData.maxJobPosts,
          approved: transformedJobPostingData.approved,
          pending: transformedJobPostingData.pending,
          expired: transformedJobPostingData.expired
        });
      });
  }

  // This method should be called within onInit within a component lising job postings
  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }

  // Adding new job posting
  addJobPosting(
    companyName: string,
    companyEmail: string,
    logo: string | File,
    id: number | null,
    jobTitle: string,
    dateFrom: string,
    dateTo: string,
    location: string,
    description: string,
    jobType: string,
    education: string,
    status: string,
    experience: number
  ) {
    const clientData = new FormData();
    clientData.append("companyName", companyName);
    clientData.append("companyEmail", companyEmail);
    clientData.append("logo", logo, companyName);
    const jobPostingData = {
      id: id,
      jobTitle: jobTitle,
      dateFrom: dateFrom,
      dateTo: dateTo,
      location: location,
      description: description,
      jobType: jobType,
      education: education,
      status: status,
      experience: experience
    };
    const newData = {
      client: clientData,
      jobPosing: jobPostingData
    };
    this.http
      .post<{ jobPosing: JobPosting }>("BACKEND_URL", newData)
      .subscribe(response => {
        this.router.navigate(["admin-dashboard"]);
      });
  }

  updateJobPosting(
    id: number,
    companyName: string,
    companyEmail: string,
    logo: File | string,
    jobTitle: string,
    dateFrom: string,
    dateTo: string,
    location: string,
    description: string,
    jobType: string,
    education: string,
    status: string,
    experience: number
  ) {
    let jobPostingData: JobPosting | FormData;
    if (typeof logo === "object") {
      jobPostingData = new FormData();
      jobPostingData.append("id", id.toString());
      jobPostingData.append("companyName", companyName);
      jobPostingData.append("companyEmail", companyEmail);
      jobPostingData.append("logo", logo, companyName);
      jobPostingData.append("jobTitle", jobTitle);
      jobPostingData.append("dateFrom", dateFrom);
      jobPostingData.append("dateTo", dateTo);
      jobPostingData.append("location", location);
      jobPostingData.append("description", description);
      jobPostingData.append("jobType", jobType);
      jobPostingData.append("education", education);
      jobPostingData.append("status", status);
      jobPostingData.append("experience", experience.toString());
    } else {
      jobPostingData = {
        id: id,
        companyName: companyName,
        companyEmail: companyEmail,
        logo: logo,
        jobTitle: jobTitle,
        dateFrom: dateFrom,
        dateTo: dateTo,
        location: location,
        description: description,
        jobType: jobType,
        education: education,
        status: status,
        experience: experience
      };
    }
    this.http
      .put("http://localhost:3000/dataJPupdate" + id, jobPostingData)
      .subscribe(response => {});
  }
}
