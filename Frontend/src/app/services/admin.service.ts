import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JobPosting } from "../models/job-posting.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Applicant } from "../models/applicant.model";
import { Application } from "../models/application.model";
import { Client } from "../models/client.model";

@Injectable({ providedIn: "root" })
export class AdminService {
  // Local list of job postings
  private jobPostings: JobPosting[] = [];

  // Observable watching when JobPosings get updated
  private jobPostingsUpdated = new Subject<{
    jobPostings: JobPosting[];
    jobPostingCount: number;
  }>();

  // Local list of applicants
  private applicants: Applicant[] = [];

  // Observable watching when applicants get updated
  private applicantsUpdated = new Subject<{
    applicants: Applicant[];
    applicantsCount: number;
  }>();

  // Local list of applications
  private applications: Application[] = [];

  // Observable watching when applications get updated
  private applicationsUpdated = new Subject<{
    applications: Application[];
    applicationsCount: number;
  }>();

  // Local list of clients
  private clients: Client[] = [];

  // Observable watching when clients get updated
  private clientsUpdated = new Subject<{
    clients: Client[];
    clientsCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  /* === JOB POSTINGS === */

  // Get all job postings
  getJobPostings(jobPostingsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${jobPostingsPerPage}&page=${currentPage}`;
    this.http
      .get<{ jobPostings: any; maxJobPosts: number }>(
        "BACKEND_URL" + queryParams
      )
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

  // This method should be called within onInit within a component lising job postings
  getJobPostingUpdateListener() {
    return this.jobPostingsUpdated.asObservable();
  }

  // Adding new job posting
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
      experience: experience
    };
    this.http
      .post<{ jobPosing: JobPosting }>("BACKEND_URL", jobPostingData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  /* === APPLICANTS === */

  // This method should be called within onInit within a component applicants postings
  getApplicantsUpdateListener() {
    return this.applicantsUpdated.asObservable();
  }

  // Get all applicants
  getApplicants(applicantsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${applicantsPerPage}&page=${currentPage}`;
    this.http
      .get<{ applicants: any; maxApplicants: number }>(
        "BACKEND_URL" + queryParams
      )
      .pipe(
        map(applicantsData => {
          return {
            applicants: applicantsData.applicants.map(applicant => {
              return {
                phoneNumber: applicant.phoneNumber,
                experience: applicant.experience,
                education: applicant.education,
                educationType: applicant.educationType
              };
            }),
            maxApplicants: applicantsData.maxApplicants
          };
        })
      )
      .subscribe(transformedApplicantsData => {
        this.applicants = transformedApplicantsData.applicants;
        this.applicantsUpdated.next({
          applicants: [...this.applicants],
          applicantsCount: transformedApplicantsData.maxApplicants
        });
      });
  }

  /* === APPLICATIONS === */

  // This method should be called within onInit within a component applications postings
  getApplicationsUpdateListener() {
    return this.applicationsUpdated.asObservable();
  }

  // Get all applications
  getApplications(applicationsPerPage: number, currentPage: number, sortedBy: string, sortDirection: number, filterBy: string) {
    const queryParams = `?pagesize=${applicationsPerPage}&page=${currentPage}&sort=${sortedBy}&sortDir=${sortDirection}&filter=${filterBy}`;
    this.http
      .get<{ applications: Application[]; maxApplictions: number }>(
        "BACKEND_URL" + queryParams
      )
      .pipe(
        map(applicationsData => {
          return {
            applications: applicationsData.applications.map(application => {
              return {
                id: application.id,
                applicantName: application.applicantName,
                applicantEmail: application.applicantEmail,
                jobTitle: application.jobTitle,
                experience: application.experience,
                postedOn: application.postedOn,
                status: application.status
              };
            }),
            maxApplictions: applicationsData.maxApplictions
          };
        })
      )
      .subscribe(transformedApplicationsData => {
        this.applications = transformedApplicationsData.applications;
        this.applicationsUpdated.next({
          applications: [...this.applications],
          applicationsCount: transformedApplicationsData.maxApplictions
        });
      });
  }

  /* === CLIENTS === */

  // This method should be called within onInit within a component clients postings
  getClientsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  // Get all applications
  getClients(clientsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${clientsPerPage}&page=${currentPage}`;
    this.http
      .get<{ clients: any; maxClients: number }>("BACKEND_URL" + queryParams)
      .pipe(
        map(clientsData => {
          return {
            clients: clientsData.clients.map(client => {
              return {
                id: client.id,
                email: client.email,
                name: client.name,
                phoneNumber: client.phoneNumber
              };
            }),
            maxClients: clientsData.maxClients
          };
        })
      )
      .subscribe(transformedClientsData => {
        this.clients = transformedClientsData.clients;
        this.clientsUpdated.next({
          clients: [...this.clients],
          clientsCount: transformedClientsData.clients
        });
      });
  }
}
