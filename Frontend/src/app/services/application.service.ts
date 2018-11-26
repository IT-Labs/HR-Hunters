import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Application } from "../models/application.model";

@Injectable({ providedIn: "root" })
export class ApplicationService {
  
  // Local list of applications
  private applications: Application[] = [];

  // Observable watching when applications get updated
  private applicationsUpdated = new Subject<{
    applications: Application[];
    applicationsCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // This method should be called within onInit within a component applications postings
  getApplicationsUpdateListener() {
    return this.applicationsUpdated.asObservable();
  }

  // Get all applications
  getApplications(
    applicationsPerPage: number,
    currentPage: number,
    sortedBy: string,
    sortDirection: number,
    filterBy: string
  ) {
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
                applicantFirstName: application.applicantFirstName,
                applicantLastName: application.applicantLastName,
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
}
