import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ApplicationService } from "src/app/services/application.service";
import { Application } from "src/app/models/application.model";

@Component({
  selector: "app-applicant-applications",
  templateUrl: "./applicant-applications.component.html",
  styleUrls: ["./applicant-applications.component.scss"]
})
export class ApplicantApplicationsComponent implements OnInit {
  applicationsQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "dateTo",
    currentSortDirection: 0
  };
  applications: Application[] = [];
  loggedInUser;
  loading = false;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.applicationsQP);
    this.applicationService
      .getApplications(params)
      .subscribe(applicationData => {
        this.applications = this.applications.concat(
          applicationData.applications
        );
        this.loading = false;
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&id=${
      this.loggedInUser.id
    }`;
  }

  onScrollDown() {
    this.loading = true;
    this.applicationsQP.currentPage++;
    const params = this.buildQueryParams(this.applicationsQP);
    this.applicationService.getApplications(params).subscribe(applicationData => {
      this.applications = this.applications.concat(
        applicationData.applications
      );
      this.loading = false;
    });
  }
}
