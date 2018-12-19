import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment.prod";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "./auth.service";

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

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
      }, error => {
        if (error.status == 401) {
          this.authService.logout()
          return
        }
        if (error.error) {
          this.toastrService.error(
            error.error.errors.Error[0],
            "Error occured!"
          );
        }
      });
  }

  // Get single job posting
  getJobPosting(id) {
    this.http
      .get<{
        id: number;
        jobTitle: string;
        companyName: string;
        companyEmail: string;
        jobType: string;
        description: string;
        dateTo: string;
        allApplicationsCount: number;
        status: string;
      }>(this.baseUrl + "/Jobs/" + id)
      .subscribe(
        jobPostingData => {
          this.jobPostingEdit.next(jobPostingData);
        },
        error => {
          if (error.status == 401) {
            this.authService.logout()
            return
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
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
        };
      }>(this.baseUrl + "/Jobs", jobPostingData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/job-postings"]);
            this.toastrService.success("", "Job posting added successfully!");
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout()
            return
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  updateJobPostingStatus(jobPostingData) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Jobs", jobPostingData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/job-postings"]);
            this.toastrService.success("", "Job posting status updated successfully!");
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout()
            return
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  updateJobPosting(jobPostingData) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Jobs", jobPostingData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/job-postings"]);
            this.toastrService.success("", "Job posting updated successfully!");
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout()
            return
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }
}
