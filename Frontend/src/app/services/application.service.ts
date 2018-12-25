import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Application } from "../models/application.model";
import { environment } from "../../environments/environment.prod";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class ApplicationService {
  baseUrl = environment.baseUrl;

  // Observable watching when applications get updated
  private applicationsUpdated = new Subject<{
    applications: Application[];
    applicationsCount: number;
    pending: number;
    contacted: number;
    interviewed: number;
    hired: number;
    rejected: number;
  }>();

  private application = new Subject<{
    application: Application;
  }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  // This method should be called within onInit within a component applications postings
  getApplicationsUpdateListener() {
    return this.applicationsUpdated.asObservable();
  }

  getApplicationListener() {
    return this.application.asObservable();
  }

  // Get all applications
  getApplications(queryParams) {
    this.http
      .get<{
        applications: Application[];
        maxApplications: number;
        pending: number;
        contacted: number;
        interviewed: number;
        hired: number;
        rejected: number;
      }>(this.baseUrl + "/Applications" + queryParams)
      .subscribe(
        applicationsData => {
          this.applicationsUpdated.next({
            applications: applicationsData.applications,
            applicationsCount: applicationsData.maxApplications,
            pending: applicationsData.pending,
            contacted: applicationsData.contacted,
            interviewed: applicationsData.interviewed,
            hired: applicationsData.hired,
            rejected: applicationsData.rejected
          });
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
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

  getApplication(applicationId) {
    this.http
      .get<{
        id: number;
        applicantFirstName: string;
        applicantLastName: string;
        applicantEmail: string;
        jobTitle: string;
        description: string;
        experience: string;
        postedOn: string;
        dateFrom: string;
        dateTo: string;
        status: string;
        jobType: string;
      }>(this.baseUrl + "/Applications/" + applicationId)
      .subscribe(
        applicationData => {
          this.application.next({
            application: applicationData
          });
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
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

  updateApplication(applicationData) {
    // return this.http.put('', data);
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Applications", applicationData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/applications"]);
            this.toastrService.success("", "Application updated successfully!");
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
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

  addApplication(applicationData) {
    this.http
      .post<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Applications", applicationData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/applicant/job-postings"]);
            this.toastrService.success(
              "",
              "You've applied to this job successfully!"
            );
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
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
