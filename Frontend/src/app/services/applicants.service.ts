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
    applicantsQP
  ) {
    const queryParams = `?pagesize=${applicantsQP.applicantsPerPage}&page=${applicantsQP.currentPage}&sort=${applicantsQP.sortedBy}&sortDir=${applicantsQP.sortDirection}&filter=${applicantsQP.filterBy}`;
    this.http
      .get<{ applicants: Applicant[]; maxApplicants: number }>(
        "http://localhost:3000/dataApplicants" + queryParams
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
          applicants: this.applicants,
          applicantsCount: transformedApplicantsData.maxApplicants
        });
      });
  }

  updateApplicant(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    photo: File | string,
    phone: string
   
  ) {
    let applicantData: Applicant | FormData;
    if (typeof photo === "object") {
      applicantData = new FormData();
      applicantData.append("id", id.toString());
      applicantData.append("email", email);
      applicantData.append("firstName",firstName);
      applicantData.append("lastName",lastName);
      applicantData.append("photo", photo);
      applicantData.append("phone", phone);
    
    } else {
      applicantData = {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        photo: photo,
        phone: phone
     
      }
    }
    this.http.put("http://localhost:3000/dataApplicantsUpdate" + id, applicantData).subscribe(response => {
    });
  }
}
