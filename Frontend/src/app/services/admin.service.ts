import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminService {
  private jobPostings: JobPosting[] = [];
  private jobPostingsUpdated = new Subject<{
    jobPostings: JobPosting[];
    jobPostingCount: number;
  }>();
  constructor(private http: HttpClient, private router: Router) {}

  getJobPostings(jobPostingsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${jobPostingsPerPage}&page=${currentPage}`;
    this.http
      .get<{ jobPostings: any; maxJobPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(jobPostingData => {
          return {
            jobPostings: jobPostingData.jobPostings.map(jobPost => {
              return {
                id: jobPost._id,
                jobTitle: jobPost.jobTitle,
                dateFrom: jobPost.dateFrom,
                dateTo: jobPost.dateTo,
                location: jobPost.location,
                description: jobPost.description,
                category: jobPost.category,
                education: jobPost.education,
                status: jobPost.status,
                experience: jobPost.experience
              };
            }),
            maxJobPosts: jobPostingData.maxJobPosts
          };
        })
      )
      .subscribe(transformedJobPostingData => {
        this.jobPostings = transformedJobPostingData.jobPostings;
        this.jobPostingsUpdated.next({
          jobPostings: [...this.jobPostings],
          jobPostingCount: transformedJobPostingData.maxJobPosts
        });
      });
  }

  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }

  addJobPosting(
    id: string,
    jobTitle: string,
    dateFrom: Date,
    dateTo: Date,
    location: string,
    description: string,
    category: string,
    education: string,
    status: string,
    experience: number
  ) {
    const jobPostingData: JobPosting = {
        id: id,
        jobTitle: jobTitle,
        dateFrom: dateFrom,
        dateTo: dateTo,
        location: location,
        description: description,
        category: category,
        education: education,
        status: status,
        experience: experience,
    }
    this.http
      .post<{ jobPosing: JobPosting }>(BACKEND_URL, jobPostingData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  getApplicants() {}

  getApplications() {}

  getClients() {}
}
