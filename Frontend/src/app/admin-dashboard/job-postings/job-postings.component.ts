import { Component, OnInit, OnDestroy } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { Subscription } from "rxjs";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";

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
    previousPage: 0,
    currentSortBy: "dateTo",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: null,
    currentFilterQuery: null
  }

  jobPostings: JobPosting[] = [];
  paginationSize: number[] = [];

  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService, private router: Router) {}

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
    if (data.currentFilter === null) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}`;
    }
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}`;
  }

  buildJobPostingDataOnUpdate(
    id: number,
    companyName: string,
    companyEmail: string,
    jobTitle: string,
    dateFrom: string,
    dateTo: string,
    companyLocation: string,
    description: string,
    jobType: string,
    education: string,
    status: string,
    experience: number
  ) {
    let jobPostingData: JobPosting;
    jobPostingData = {
      id: id,
      companyName: companyName,
      companyEmail: companyEmail,
      jobTitle: jobTitle,
      dateFrom: dateFrom,
      dateTo: dateTo,
      companyLocation: companyLocation,
      description: description,
      jobType: jobType,
      education: education,
      status: status,
      experience: experience
    };

    return jobPostingData;
  }

  onEditJobPosting(id: number) {
    this.jobPostingService.editJobPostingId = id;
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
    if (this.jobPostingQP.currentPage !== this.jobPostingQP.previousPage) {
      this.jobPostingQP.previousPage = this.jobPostingQP.currentPage;
      const params = this.buildQueryParams(this.jobPostingQP);
      this.jobPostingService.getJobPostings(params);
    }
  }

  onFilter(filterBy: string) {

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
      if (this.jobPostingQP.currentSortDirection === 1) {
        this.jobPostingQP.currentSortDirection = 0;
      } else if (this.jobPostingQP.currentSortDirection === 0) {
        this.jobPostingQP.currentSortDirection = 1;
      }
      this.jobPostingQP.lastSortBy = '';
    } else if (this.jobPostingQP.lastSortBy !== sortBy) {
      if (this.jobPostingQP.currentSortDirection === 1) {
        this.jobPostingQP.currentSortDirection = 0;
      } else if (this.jobPostingQP.currentSortDirection === 0) {
        this.jobPostingQP.currentSortDirection = 1;
      }
      this.jobPostingQP.lastSortBy = sortBy;
    }
    this.jobPostingQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
  }

  chooseStatus(event: any, id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;

    const jobPostingData = this.buildJobPostingDataOnUpdate(
      currentId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      currentStatus,
      null
    )
    this.jobPostingService.updateJobPosting(jobPostingData);
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
