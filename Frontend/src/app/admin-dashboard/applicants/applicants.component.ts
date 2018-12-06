import { Component, OnInit, OnDestroy } from "@angular/core";
import { Applicant } from "src/app/models/applicant.model";
import { Subscription } from "rxjs";
import { ApplicantService } from "src/app/services/applicants.service";

@Component({
  selector: "app-ad-applicants",
  templateUrl: "./applicants.component.html",
  styleUrls: ["./applicants.component.scss"]
})
export class ADApplicantsComponent implements OnInit, OnDestroy {
  applicantsCount = {
    all: 0
  };

  applicants: Applicant[] = [];

  applicantsQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "firstName",
    lastSortBy: "",
    currentSortDirection: 0
  };

  paginationSize: number[] = [];
  private applicantsSub: Subscription;

  constructor(private applicantService: ApplicantService) {}

  ngOnInit() {
    const params = this.buildQueryParams(this.applicantsQP);
    this.applicantService.getApplicants(params);
    this.applicantsSub = this.applicantService
      .getApplicantsUpdateListener()
      .subscribe(applicantData => {
        this.applicants = applicantData.applicants;
        this.applicantsCount.all = applicantData.applicantsCount;
        this.calculatePagination(this.applicantsCount.all);
      });
  }

  buildQueryParams(data) {
  return `?pagesize=${data.postsPerPage}
          &page=${data.currentPage}
          &sort=${data.currentSortBy}
          &sortDir=${data.currentSortDirection}`;  
  }

  calculatePagination(applicantsCount: number) {
    this.paginationSize = [];
    const paginationSum = Math.ceil(applicantsCount / 10);

    if (paginationSum > 0 && paginationSum < 11) {
      for (let i = 1; i < paginationSum + 1; i++) {
        const num = i;
        this.paginationSize.push(num);
      }
    } else if (paginationSum > 10) {
      if (
        this.applicantsQP.currentPage - 10 < paginationSum - 10 &&
        this.applicantsQP.currentPage < 6
      ) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.applicantsQP.currentPage - 10 < paginationSum - 10) {
        for (
          let i = this.applicantsQP.currentPage - 5;
          i < this.applicantsQP.currentPage + 5;
          i++
        ) {
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

  onChangedPage(page: number) {
    this.applicantsQP.currentPage = page;
    const params = this.buildQueryParams(this.applicantsQP);
    this.applicantService.getApplicants(params);
  }

  onSort(sortBy: any) {
    if (this.applicantsQP.lastSortBy === sortBy) {
      this.applicantsQP.currentSortDirection = 1;
    } else {
      this.applicantsQP.currentSortDirection = 0;
      this.applicantsQP.lastSortBy = sortBy;
    }
    this.applicantsQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.applicantsQP);
    this.applicantService.getApplicants(params);
  }

  ngOnDestroy() {
    this.applicantsSub.unsubscribe();
  }
}
