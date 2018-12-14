import { Component, OnInit } from '@angular/core';
import { JobPosting } from 'src/app/models/job-posting.model';
import { JobPostingService } from 'src/app/services/job-posting.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-postings-list',
  templateUrl: './job-postings-list.component.html',
  styleUrls: ['./job-postings-list.component.scss']
})
export class JobPostingsListComponent implements OnInit {

  jobPostingQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "dateTo",
    currentSortDirection: 0
  }
  jobPostings: JobPosting[] = [];
  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService) { }

  ngOnInit() {
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.jobPostingSub = this.jobPostingService
      .getJobPostingUpdateListener()
      .subscribe(jobPostingData => {
        this.jobPostings = this.jobPostings.concat(jobPostingData.jobPostings);
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}`;
  }

  onScrollDown() {
    this.jobPostingQP.currentPage++;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    console.log('scrolled down')
  }
 
  onScrollUp() {}

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
