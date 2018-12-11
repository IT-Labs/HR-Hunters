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
        jobPostings: JobPosting[];
        maxJobPostings: number;
        approved: number;
        pending: number;
        expired: number;
      }>(this.baseUrl + "/Jobs" + queryParams)
      .subscribe(jobPostingData => {
        this.jobPostingsUpdated.next({
          jobPostings: jobPostingData.jobPostings,
          jobPostingCount: jobPostingData.maxJobPostings,
          approved: jobPostingData.approved,
          pending: jobPostingData.pending,
          expired: jobPostingData.expired
        });
      });
  }

  // This method should be called within onInit within a component lising job postings
  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }

  // Adding new job posting
  addJobPosting(jobPostingData) {
    this.http
      .post<{ jobPosing: JobPosting }>("/Jobs", jobPostingData)
      .subscribe(response => {
        this.router.navigate(["admin-dashboard"]);
      });
  }

  updateJobPosting(jobPostingData) {
    this.http
      .put(
        "/Jobs" + jobPostingData.id,
        jobPostingData
      )
      .subscribe(response => {});
  }
}
