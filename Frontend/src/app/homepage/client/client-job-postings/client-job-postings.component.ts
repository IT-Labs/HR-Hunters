import { Component } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { AuthService } from "src/app/services/auth.service";
import { JobPostingService } from "src/app/services/job-posting.service";

@Component({
  selector: "app-client-job-postings",
  templateUrl: "./client-job-postings.component.html"
})
export class ClientJobPostingsComponent {
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
    private authService: AuthService
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

  onScrollDown() {
    this.loading = true;
    this.jobPostingQP.currentPage++;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params).subscribe(jobPostingData => {
      this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
      this.loading = false;
    });
  }
}
