import { Component, OnInit, OnDestroy } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { Subscription } from "rxjs";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

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
    expired: 0,
    rejected: 0
  };

  paginationMaxSize = 0;

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

  loading = false;
  loggedInUser;

  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser()
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
        this.jobPostingsCount.rejected = jobPostingData.rejected
        this.loading = false;
      });
      setTimeout(() => {
        this.paginationMaxSize = this.jobPostingsCount.all
      }, 1000);
  }

  buildQueryParams(data) {
    if (data.currentFilter === null) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&id=${this.loggedInUser.id}`;
    }
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}&id=${this.loggedInUser.id}`;
  }

  buildJobPostingDataOnUpdate(
    id: number,
    status: string,
    jobTitle: string,
    description: string,
    jobType: string,
    education: string,
    experience: number,
    dateFrom: string,
    dateTo: string
  ) {
    let jobPostingData: JobPosting;
    jobPostingData = {
      id: id,
      status: status,
      jobTitle: jobTitle,
      description: description,
      jobType: jobType,
      education: education,
      experience: experience,
      dateFrom: dateFrom,
      dateTo: dateTo
    };
    return jobPostingData;
  }

  onEditJobPosting(id: number) {
    this.jobPostingService.editJobPostingId = id;
  }

  onChangedPage(page: number) {
    this.loading = true;
    if (this.jobPostingQP.currentPage !== this.jobPostingQP.previousPage) {
      this.jobPostingQP.previousPage = this.jobPostingQP.currentPage;
      const params = this.buildQueryParams(this.jobPostingQP);
      this.jobPostingService.getJobPostings(params);
      this.loading = false;
    }
  }

  onFilter(filterBy: string) {
    this.loading = true;
    if (filterBy === null) {
      this.jobPostingQP.currentFilter = null
    } else {
      this.jobPostingQP.currentFilter = 'status'
    }

    // CALCULATE PAGINATION
    if (filterBy === null) {
      this.paginationMaxSize = this.jobPostingsCount.all
    } else if (filterBy === 'Pending') {
      this.paginationMaxSize = this.jobPostingsCount.pending
    } else if (filterBy === 'Expired') {
      this.paginationMaxSize = this.jobPostingsCount.expired
    } else if (filterBy === 'Approved') {
      this.paginationMaxSize = this.jobPostingsCount.approved
    } else if (filterBy === 'Rejected') {
      this.paginationMaxSize = this.jobPostingsCount.rejected
    }

    this.jobPostingQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.jobPostingQP);
    this.jobPostingService.getJobPostings(params);
    this.loading = false;
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
    this.loading = true;
    const currentStatus = event.target.innerText;
    const currentId = id;

    const jobPostingData = this.buildJobPostingDataOnUpdate(
      currentId,
      currentStatus,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    )
    this.jobPostingService.updateJobPostingStatus(jobPostingData);

    setTimeout(() => {
      const params = this.buildQueryParams(this.jobPostingQP);
      this.jobPostingService.getJobPostings(params);
      this.loading = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
