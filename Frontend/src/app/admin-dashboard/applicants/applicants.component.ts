import { Component, OnInit, OnDestroy } from "@angular/core";
import { Applicant } from "src/app/models/applicant.model";
import { Subscription } from "rxjs";
import { ApplicantService } from "src/app/services/applicants.service";

@Component({
  selector: "app-ad-applicants",
  templateUrl: "./applicants.component.html",
  styleUrls: ["./applicants.component.scss"]
})
export class ADApplicantsComponent implements OnInit,OnDestroy {
  applicantsCount = {
    all: 0
  };
  applicants: Applicant[] = [];
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = "Expires";
  currentSortDirection = 1;
  currentFilter = "All";
  lastSortBy = "";
  paginationSize: number[] = [];
  private applicantsSub: Subscription;

  constructor(private applicantService: ApplicantService) {}

  ngOnInit() {
    this.applicantService.getApplicants(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
    this.applicantsSub = this.applicantService
      .getApplicantsUpdateListener()
      .subscribe(applicantData => {
        this.applicants = applicantData.applicants;
        this.applicantsCount.all = applicantData.applicantsCount;
        this.calculatePagination(this.applicantsCount.all)
      });
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
      if (this.currentPage - 10 < paginationSum - 10 && this.currentPage < 6) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.currentPage - 10 < paginationSum - 10) {
        for (let i = this.currentPage - 5; i < this.currentPage + 5; i++) {
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
    this.currentPage = page;
    this.applicantService.getApplicants(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onFilter(filterBy: string) {
    this.currentFilter = filterBy;
    this.applicantService.getApplicants(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onSort(sortBy: any) {
    if (this.lastSortBy === sortBy) {
      this.currentSortDirection++;
    } else {
      this.lastSortBy = sortBy;
    }
    this.currentSortBy = sortBy;
    this.applicantService.getApplicants(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  chooseStatus(event: any,  id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;
    let currentApplicant: Applicant;
    for (let i = 0; i < this.applicants.length; i++) {
      if (currentId === this.applicants[i].id) {
        currentApplicant = this.applicants[i];
      }
  }

  this.applicantService.updateApplicant(
    currentId,
    currentApplicant.email,
    currentApplicant.firstName,
    currentApplicant.lastName,
    currentApplicant.photo,
    currentApplicant.phone

  );
}
ngOnDestroy() {
  this.applicantsSub.unsubscribe();
}
}
