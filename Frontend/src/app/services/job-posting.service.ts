import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class JobPostingService {
  // Local list of job postings
  private jobPostings: JobPosting[] = [];

  // Observable watching when JobPosings get updated
  private jobPostingsUpdated = new Subject<{
    jobPostings: JobPosting[];
    jobPostingCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Get all job postings
  getJobPostings(
    jobPostingsPerPage: number,
    currentPage: number,
    sortedBy: string,
    sortDirection: number,
    filterBy: string
  ) {
    const queryParams = `?pagesize=${jobPostingsPerPage}&page=${currentPage}&sort=${sortedBy}&sortDir=${sortDirection}&filter=${filterBy}`;
    this.http
      .get<{ jobPostings: JobPosting[]; maxJobPosts: number }>(
        "BACKEND_URL" + queryParams
      )
      .pipe(
        map(jobPostingData => {
          return {
            jobPostings: jobPostingData.jobPostings.map(jobPost => {
              return {
                id: jobPost.id,
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

  // This method should be called within onInit within a component lising job postings
  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }

  // Adding new job posting
  addJobPosting(
    id: number,
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
      experience: experience
    };
    this.http
      .post<{ jobPosing: JobPosting }>("BACKEND_URL", jobPostingData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
}
