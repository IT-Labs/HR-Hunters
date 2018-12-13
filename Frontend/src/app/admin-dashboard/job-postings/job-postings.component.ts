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
    expired: 0,
    rejected: 0
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
        this.jobPostingsCount.rejected = jobPostingData.rejected
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
