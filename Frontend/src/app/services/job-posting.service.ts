import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class JobPostingService {
  baseUrl = environment.baseUrl;

  editJobPostingId: number;

  // Observable watching when JobPosings get updated
  private jobPostingsUpdated = new Subject<{
    jobPostings: JobPosting[];
    jobPostingCount: number;
    approved: number;
    pending: number;
    expired: number;
    rejected: number;
  }>();
  
  private jobPostingEdit = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}

  // Get all job postings
  getJobPostings(queryParams) {
    this.http
      .get<{
        jobPostings: JobPosting[];
        maxJobPosts: number;
        approved: number;
        pending: number;
        expired: number;
        rejected: number;
      }>(this.baseUrl + "/Jobs" + queryParams)
      .subscribe(jobPostingData => {
        this.jobPostingsUpdated.next({
          jobPostings: jobPostingData.jobPostings,
          jobPostingCount: jobPostingData.maxJobPosts,
          approved: jobPostingData.approved,
          pending: jobPostingData.pending,
          expired: jobPostingData.expired,
          rejected: jobPostingData.rejected
        });
      });
  }
  
  // Get single job posting
  getJobPosting(id) {
    this.http
      .get<{
        id: number,
        jobTitle: string,
        companyName: string,
        companyEmail: string,
        jobType: string,
        description: string,
        dateTo: string,
        allApplicationsCount: number,
        status: string
      }>(this.baseUrl + "/Jobs/" + id)
      .subscribe(jobPostingData => {
        this.jobPostingEdit.next(jobPostingData)
      });
  }

  // This method should be called within onInit within a component lising job postings
  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }
  
  getJobPostingEditListener() {
    return this.jobPostingEdit.asObservable();
  }

  // Adding new job posting
  addJobPosting(jobPostingData) {
    this.http
      .post<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        }
      }>(this.baseUrl + "/Jobs", jobPostingData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["/admin-dashboard/job-postings"]);
        }
      },
      error => {
        console.log(error)
      });
  }

  updateJobPostingStatus(jobPostingData) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        }
      }>(this.baseUrl + "/Jobs", jobPostingData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["/admin-dashboard/job-postings"]);
        }
      },
      error => {
        console.log(error)
      });
  }
  
  updateJobPostingProfile(jobPostingData, jobPostingId) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        }
      }>(this.baseUrl + "/Jobs/" + jobPostingId, jobPostingData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["/admin-dashboard/job-postings"]);
        }
      },
      error => {
        console.log(error)
      });
  }
}
