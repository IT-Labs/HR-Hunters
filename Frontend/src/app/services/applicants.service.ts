import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Applicant } from "../models/applicant.model";

@Injectable({ providedIn: "root" })
export class ApplicantService {
  // Local list of applicants
  private applicants: Applicant[] = [];

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
  getApplicants(
    applicantsPerPage: number,
    currentPage: number,
    sortedBy: string,
    sortDirection: number,
    filterBy: string
  ) {
    const queryParams = `?pagesize=${applicantsPerPage}&page=${currentPage}&sort=${sortedBy}&sortDir=${sortDirection}&filter=${filterBy}`;
    this.http
      .get<{ applicants: Applicant[]; maxApplicants: number }>(
        "BACKEND_URL" + queryParams
      )
      .pipe(
        map(applicantsData => {
          return {
            applicants: applicantsData.applicants.map(applicant => {
              return {
                id: applicant.id,
                email: applicant.email,
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                photo: applicant.photo,
                phone: applicant.phone
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
}
