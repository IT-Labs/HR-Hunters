import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class LinkedInService {
  constructor(private http: HttpClient) {}

  getProfileInfo() {
    return this.http.get("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=8633xa4xtxl3gj&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fapplicant%2Fprofile&state=GKw9ZfiVK2StfjUl");
  }
}