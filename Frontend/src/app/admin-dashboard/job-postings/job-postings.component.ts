import { Component, OnInit, OnDestroy } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { Subscription } from "rxjs";
import { JobPostingService } from "src/app/services/job-posting.service";

@Component({
  selector: "app-ad-job-postings",
  templateUrl: "./job-postings.component.html",
  styleUrls: ["./job-postings.component.scss"]
})
export class ADJobPostingsComponent implements OnInit, OnDestroy {
  jobPostingsCount = {
    all: 0,
    approved: 0,
    pending: 0,
    expired: 0
  };

  selectedTab = {
    jobs: true,
    new: false
  };

  jobPostingQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "dateTo",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: 'status',
    currentFilterQuery: null
  }

  jobPostings: JobPosting[] = [];
  paginationSize: number[] = [];

  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService) {}

  ngOnInit() {
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.jobPostingSub = this.jobPostingService
      .getJobPostingUpdateListener()
      .subscribe(jobPostingData => {
        this.jobPostings = jobPostingData.jobPostings;
        this.jobPostingsCount.all = jobPostingData.jobPostingCount;
        this.jobPostingsCount.approved = jobPostingData.approved;
        this.jobPostingsCount.pending = jobPostingData.pending;
        this.jobPostingsCount.expired = jobPostingData.expired;
        this.calculatePagination(this.jobPostingsCount.all);
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}`;
  }

  calculatePagination(jobPostingsCount: number) {
    this.paginationSize = [];
    const paginationSum = Math.ceil(jobPostingsCount / 10);

    if (paginationSum > 0 && paginationSum < 11) {
      for (let i = 1; i < paginationSum + 1; i++) {
        const num = i;
        this.paginationSize.push(num);
      }
    } else if (paginationSum > 10) {
      if (this.jobPostingQP.currentPage - 10 < paginationSum - 10 && this.jobPostingQP.currentPage < 6) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.jobPostingQP.currentPage - 10 < paginationSum - 10) {
        for (let i = this.jobPostingQP.currentPage - 5; i < this.jobPostingQP.currentPage + 5; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else {
        for (let i = paginationSum - 9; i < paginationSum + 1; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      }
    }
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

  onChangedPage(page: number) {
    this.jobPostingQP.currentPage = page;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
  }

  onFilter(filterBy: number) {

    if (filterBy === null) {
      this.jobPostingQP.currentFilter = null
    } else {
      this.jobPostingQP.currentFilter = 'status'
    }

    this.jobPostingQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
  }

  onSort(sortBy: any) {
    if (this.jobPostingQP.lastSortBy === sortBy) {
      this.jobPostingQP.currentSortDirection = 1;
    } else {
      this.jobPostingQP.lastSortBy = sortBy;
      this.jobPostingQP.currentSortDirection = 0;
    }
    this.jobPostingQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
  }

  chooseStatus(event: any, id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;
    let currentJobPosting: JobPosting;
    for (let i = 0; i < this.jobPostings.length; i++) {
      (currentId === this.jobPostings[i].id) && (currentJobPosting = this.jobPostings[i]);
    }

    this.jobPostingService.updateJobPosting(
      currentId,
      currentJobPosting.companyName,
      currentJobPosting.companyEmail,
      currentJobPosting.logo,
      currentJobPosting.jobTitle,
      currentJobPosting.dateFrom,
      currentJobPosting.dateTo,
      currentJobPosting.location,
      currentJobPosting.description,
      currentJobPosting.jobType,
      currentJobPosting.education,
      currentStatus,
      currentJobPosting.experience
    );
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
