import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Application } from "../models/application.model";
import { environment } from "../../environments/environment.prod";

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

  constructor(private http: HttpClient, private router: Router) {}

  // This method should be called within onInit within a component applications postings
  getApplicationsUpdateListener() {
    return this.applicationsUpdated.asObservable();
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
      .subscribe(applicationsData => {
        this.applicationsUpdated.next({
          applications: applicationsData.applications,
          applicationsCount: applicationsData.maxApplications,
          pending: applicationsData.pending,
          contacted: applicationsData.contacted,
          interviewed: applicationsData.interviewed,
          hired: applicationsData.hired,
          rejected: applicationsData.rejected
        });
      });
  }

  updateApplication(applicationData) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        }
      }>(this.baseUrl + "/Applications", applicationData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["/admin-dashboard/applications"]);
        }
      },
      error => {
        console.log(error)
      });
  }
}
