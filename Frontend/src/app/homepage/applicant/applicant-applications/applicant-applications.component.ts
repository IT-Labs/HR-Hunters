import { Component, OnInit } from '@angular/core';
import { JobPosting } from 'src/app/models/job-posting.model';
import { JobPostingService } from 'src/app/services/job-posting.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-applicant-applications',
  templateUrl: './applicant-applications.component.html',
  styleUrls: ['./applicant-applications.component.scss']
})
export class ApplicantApplicationsComponent implements OnInit {

  jobPostingQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "dateTo",
    currentSortDirection: 0
  }
  jobPostings: JobPosting[] = [];

  loggedInUser;

  loading = false;
  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService, private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.jobPostingSub = this.jobPostingService
      .getJobPostingUpdateListener()
      .subscribe(jobPostingData => {
        this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
        this.loading = false;
      });
    this.loggedInUser = this.authService.getUser()
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&id=${this.loggedInUser.id}`;
  }

  onScrollDown() {
    this.loading = true;
    this.jobPostingQP.currentPage++;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.loading = false;
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }

}
