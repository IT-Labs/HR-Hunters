import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Applicant } from "../models/applicant.model";
import { environment } from "../../environments/environment.prod";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class ApplicantService {
  baseUrl = environment.baseUrl;

  // Observable watching when applicants get updated
  private applicantsUpdated = new Subject<{
    applicants: Applicant[];
    applicantsCount: number;
  }>();

  private applicantProfile = new Subject<{
    applicant: Applicant;
  }>();

  private applicantErrorListener = new Subject<{
    error: string;
  }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  // This method should be called within onInit within a component applicants postings
  getApplicantsUpdateListener() {
    return this.applicantsUpdated.asObservable();
  }

  getApplicantProfileListener() {
    return this.applicantProfile.asObservable();
  }

  getClientErrorListener() {
    return this.applicantErrorListener.asObservable();
  }

  // Get all applicants
  getApplicants(queryParams) {
    this.http
      .get<{ applicants: Applicant[]; maxApplicants: number }>(
        this.baseUrl + "/Applicants" + queryParams
      )
      .subscribe(
        applicantsData => {
          this.applicantsUpdated.next({
            applicants: applicantsData.applicants,
            applicantsCount: applicantsData.maxApplicants
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

  getApplicant(applicantId) {
    this.http
      .get<{
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        photo: string;
        email: string;
      }>(this.baseUrl + "/Applicants/" + applicantId)
      .subscribe(
        applicantsData => {
          this.applicantProfile.next({
            applicant: applicantsData
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

  updateApplicant(applicantData, applicantId) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Applicants/" + applicantId, applicantData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/applicants"]);
            this.toastrService.success("", "Profile was successfully updated!");
          } else if (!response.succeeded) {
            this.applicantErrorListener.next({
              error: response.errors.Error[0]
            });
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

  uploadApplicantLogo(applicantId, logo) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Uploads/Image/" + applicantId, logo)
      .subscribe(response => {
        if (response.succeeded) {
          this.toastrService.success("", "Image updloaded successfully!");
        }
      }, error => {
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
      });
  }
}
