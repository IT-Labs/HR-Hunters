import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { ApplicationService } from "src/app/services/application.service";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-job-postings-list",
  templateUrl: "./job-postings-list.component.html"
})
export class JobPostingsListComponent implements OnInit {
  jobPostingQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "dateTo",
    currentSortDirection: 0
  };
  jobPostings: JobPosting[] = [];
  loggedInUser;
  loading = false;

  constructor(
    private jobPostingService: JobPostingService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params).subscribe(jobPostingData => {
      this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
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

  buildApplicationData(applicantId: number, jobId: number) {
    const applicationData = {
      applicantId: applicantId,
      jobId: jobId
    };
    return applicationData;
  }

  onScrollDown() {
    this.loading = true;
    this.jobPostingQP.currentPage++;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params).subscribe(jobPostingData => {
      this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
      this.loading = false;
    });
    this.loading = false;
  }

  onApply(jobId: number) {
    this.loading = true;
    let applicationData = this.buildApplicationData(
      this.loggedInUser.id,
      jobId
    );
    this.applicationService.addApplication(applicationData).subscribe(
      response => {
        const params = this.buildQueryParams(this.jobPostingQP);
        this.jobPostings = [];
        this.jobPostingService
          .getJobPostings(params)
          .subscribe(jobPostingData => {
            this.jobPostings = this.jobPostings.concat(
              jobPostingData.jobPostings
            );
            this.loading = false;
            this.router.navigate(["/applicant/job-postings"]);
            this.toastr.success("", "You've applied to this job successfully!");
          });
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.toastr.error(error.error.errors.Error[0], "Error occured!");
          this.loading = false;
        }
      }
    );
  }
}
