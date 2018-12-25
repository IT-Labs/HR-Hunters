import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Applicant } from "../models/applicant.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ApplicantService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getApplicants(queryParams) {
    return this.http.get<{ applicants: Applicant[]; maxApplicants: number }>(
      this.baseUrl + "/Applicants" + queryParams
    );
  }
  getApplicant(applicantId) {
    return this.http.get<Applicant>(
      this.baseUrl + "/Applicants/" + applicantId
    );
  }

  updateApplicant(applicantData, applicantId) {
    return this.http.put(
      this.baseUrl + "/Applicants/" + applicantId,
      applicantData
    );
  }

  uploadApplicantLogo(applicantId, logo) {
    return this.http.put(this.baseUrl + "/Uploads/Image/" + applicantId, logo);
  }
}
