import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Application } from "../models/application.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ApplicationService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getApplications(queryParams) {
    return this.http.get<{
      applications: Application[];
      maxApplications: number;
      pending: number;
      contacted: number;
      interviewed: number;
      hired: number;
      rejected: number;
    }>(this.baseUrl + "/Applications" + queryParams);
  }

  getApplication(applicationId) {
    return this.http.get<Application>(
      this.baseUrl + "/Applications/" + applicationId
    );
  }

  updateApplication(applicationData) {
    return this.http.put(this.baseUrl + "/Applications", applicationData);
  }

  addApplication(applicationData) {
    return this.http.post(this.baseUrl + "/Applications", applicationData);
  }
}
