import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Application } from "../models/application.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ApplicationService {
  baseUrl = environment.baseUrl;
  // Local list of applications
  private applications: Application[] = [];

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
  getApplications(
    queryParams
  ) {
    this.http
      .get<{
        applications: Application[];
        maxApplications: number;
        pending: number;
        contacted: number;
        interviewed: number;
        hired: number;
        rejected: number;
      }>(this.baseUrl + '/Admin/applications' + queryParams)
      .pipe(
        map(applicationsData => {
          return {
            applications: applicationsData.applications.map(application => {
              return {
                id: application.id,
                applicantFirstName: application.applicantFirstName,
                applicantLastName: application.applicantLastName,
                applicantEmail: application.applicantEmail,
                jobTitle: application.jobTitle,
                experience: application.experience,
                postedOn: application.postedOn,
                status: application.status
              };
            }),
            maxApplictions: applicationsData.maxApplications,
            pending: applicationsData.pending,
            contacted: applicationsData.contacted,
            interviewed: applicationsData.interviewed,
            hired: applicationsData.hired,
            rejected: applicationsData.rejected
          };
        })
      )
      .subscribe(transformedApplicationsData => {
        this.applications = transformedApplicationsData.applications;
        this.applicationsUpdated.next({
          applications: this.applications,
          applicationsCount: transformedApplicationsData.maxApplictions,
          pending: transformedApplicationsData.pending,
          contacted: transformedApplicationsData.contacted,
          interviewed: transformedApplicationsData.interviewed,
          hired: transformedApplicationsData.hired,
          rejected: transformedApplicationsData.rejected
        });
      });
  }

  updateApplication(
    id: number,
    applicantFirstName: string,
    applicantLastName: string,
    applicantEmail: string,
    jobTitle: string,
    experience: number,
    postedOn: Date,
    status: string
  ) {
    let applicationData: Application = {
      id: id,
      applicantFirstName: applicantFirstName,
      applicantLastName: applicantLastName,
      applicantEmail: applicantEmail,
      jobTitle: jobTitle,
      experience: experience,
      postedOn: postedOn,
      status: status
    };
    this.http
      .put("http://localhost:3000/dataJPupdate" + id, applicationData)
      .subscribe(response => {});
  }
}
