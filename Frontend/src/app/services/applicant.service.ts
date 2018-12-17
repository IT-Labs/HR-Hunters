import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Applicant } from "../models/applicant.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ApplicantService {
  baseUrl = environment.baseUrl;

  // Observable watching when applicants get updated
  private applicantsUpdated = new Subject<{
    applicants: Applicant[];
    applicantsCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // This method should be called within onInit within a component applicants postings
  getApplicantsUpdateListener() {
    return this.applicantsUpdated.asObservable();
  }

  // Get all applicants
  getApplicants(queryParams) {
    this.http
      .get<{ applicants: Applicant[]; maxApplicants: number }>(
        this.baseUrl + "/Applicants" + queryParams
      )
      .subscribe(applicantsData => {
        this.applicantsUpdated.next({
          applicants: applicantsData.applicants,
          applicantsCount: applicantsData.maxApplicants
        });
      });
  }

  updateApplicant(applicantData, applicantId) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Applicants/" + applicantId, applicantData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["/admin-dashboard/applicants"]);
        }
      },
      error => {
        console.log(error)
      });
  }
}
