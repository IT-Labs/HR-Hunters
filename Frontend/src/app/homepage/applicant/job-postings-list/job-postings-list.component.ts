import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Subscription } from "rxjs";
import { ApplicationService } from "src/app/services/application.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-job-postings-list",
  templateUrl: "./job-postings-list.component.html",
  styleUrls: ["./job-postings-list.component.scss"]
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

  private jobPostingSub: Subscription;

  constructor(
    private jobPostingService: JobPostingService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.jobPostingSub = this.jobPostingService
      .getJobPostingUpdateListener()
      .subscribe(jobPostingData => {
        this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
        this.loading = false;
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&id=${this.loggedInUser.id}`;
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
    this.jobPostingService.getJobPostings(params);
    this.loading = false;
  }

  onApply(jobId: number) {
    this.loading = true;
    let applicationData = this.buildApplicationData(
      this.loggedInUser.id,
      jobId
    );
    this.applicationService.addApplication(applicationData);
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.loading = false;
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
