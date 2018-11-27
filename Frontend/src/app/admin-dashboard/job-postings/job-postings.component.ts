import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { Subscription } from "rxjs";
import { JobPostingService } from "src/app/services/job-posting.service";

@Component({
  selector: "app-ad-job-postings",
  templateUrl: "./job-postings.component.html",
  styleUrls: ["./job-postings.component.scss"]
})
export class ADJobPostingsComponent implements OnInit {
  jobPostingsCount = {
    all: 0,
    approved: 0,
    awaitingApproval: 0,
    expired: 0
  };

  selectedTab = {
    jobs: true,
    new: false
  };

  jobPostings: JobPosting[] = [];
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = "Expires";
  currentSortDirection = 1;
  currentFilter = "All";

  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService) {}

  ngOnInit() {
    this.jobPostingService.getJobPostings(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
    this.jobPostingSub = this.jobPostingService
      .getJobPostingUpdateListener()
      .subscribe(jobPostingData => {
        console.log(jobPostingData)
        this.jobPostings = jobPostingData.jobPostings;
        this.jobPostingsCount.all = jobPostingData.jobPostingCount;

      });
      console.log(this.jobPostings)
  }

  onChangeTab(event: string) {
    if (event === "jobs") {
      this.selectedTab.jobs = true;
      this.selectedTab.new = false;
    } else if (event === "new") {
      this.selectedTab.jobs = false;
      this.selectedTab.new = true;
    }
  }

  onChangedPage(pageData: any) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.jobPostingService.getJobPostings(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onFilter(pageData: any) {
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    // this.currentFilter = the cliecked el;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.jobPostingService.getJobPostings(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onSort(pageData: any) {
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    // this.currentSortBy = the cliecked el;
    this.currentSortDirection = pageData.sortDirection + 1;
    this.jobPostingService.getJobPostings(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  chooseStatus(event: any) {
    const currentStatus = event.target.innerText;
  }
}
