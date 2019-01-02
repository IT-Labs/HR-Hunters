import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JobPosting } from "../models/job-posting.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class JobPostingService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getJobPostings(queryParams) {
    return this.http.get<{
      jobPostings: JobPosting[];
      maxJobPosts: number;
      approved: number;
      pending: number;
      expired: number;
      rejected: number;
    }>(this.baseUrl + "/Jobs" + queryParams);
  }

  getJobPosting(id) {
    return this.http.get<JobPosting>(this.baseUrl + "/Jobs/" + id);
  }

  addJobPosting(jobPostingData) {
    return this.http.post(this.baseUrl + "/Jobs", jobPostingData);
  }

  updateJobPostingStatus(jobPostingData, jobPostingId) {
    return this.http.put(this.baseUrl + "/Jobs/" + jobPostingId + '/status', jobPostingData);
  }

  updateJobPosting(jobPostingData, jobPostingId) {
    return this.http.put(this.baseUrl + "/Jobs/" + jobPostingId, jobPostingData);
  }

  uploadCSV(clientId, csv) {
    return this.http.post(this.baseUrl + "/Jobs/UploadCSV/" + clientId, csv);
  }
}
