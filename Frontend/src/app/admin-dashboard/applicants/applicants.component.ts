import { Component, OnInit, OnDestroy } from "@angular/core";
import { Applicant } from "src/app/models/applicant.model";
import { Subscription } from "rxjs";
import { ApplicantService } from "src/app/services/applicant.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-ad-applicants",
  templateUrl: "./applicants.component.html",
  styleUrls: ["./applicants.component.scss"]
})
export class ADApplicantsComponent implements OnInit, OnDestroy {
  applicantsCount = {
    all: 0
  };
  loggedInUser;
  applicants: Applicant[] = [];
  applicantsQP = {
    postsPerPage: 10,
    currentPage: 1,
    previousPage: 0,
    currentSortBy: "firstName",
    lastSortBy: "",
    currentSortDirection: 0
  };
  paginationSize: number[] = [];

  loading = false;

  private applicantsSub: Subscription;

  constructor(
    private applicantService: ApplicantService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.applicantsQP);
    this.applicantService.getApplicants(params);
    this.applicantsSub = this.applicantService
      .getApplicantsUpdateListener()
      .subscribe(applicantData => {
        this.applicants = applicantData.applicants;
        this.applicantsCount.all = applicantData.applicantsCount;
        this.loading = false;
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&id=${this.loggedInUser.id}`;
  }

  buildApplicantDataOnUpdate(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    educationType: string,
    schoolUniversity: string,
    experience: string
  ) {
    let applicantData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      educationType: educationType,
      schoolUniversity: schoolUniversity,
      experience: experience
    };
    return applicantData;
  }

  onChangedPage(page: number) {
    this.loading = true;
    if (this.applicantsQP.currentPage !== this.applicantsQP.previousPage) {
      this.applicantsQP.previousPage = this.applicantsQP.currentPage;
      const params = this.buildQueryParams(this.applicantsQP);
      this.applicantService.getApplicants(params);
      this.loading = false;
    }
  }

  onSort(sortBy: any) {
    this.loading = true;
    if (this.applicantsQP.lastSortBy === sortBy) {
      if (this.applicantsQP.currentSortDirection === 1) {
        this.applicantsQP.currentSortDirection = 0;
      } else if (this.applicantsQP.currentSortDirection === 0) {
        this.applicantsQP.currentSortDirection = 1;
      }
      this.applicantsQP.lastSortBy = "";
    } else if (this.applicantsQP.lastSortBy !== sortBy) {
      if (this.applicantsQP.currentSortDirection === 1) {
        this.applicantsQP.currentSortDirection = 0;
      } else if (this.applicantsQP.currentSortDirection === 0) {
        this.applicantsQP.currentSortDirection = 1;
      }
      this.applicantsQP.lastSortBy = sortBy;
    }
    this.applicantsQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.applicantsQP);
    this.applicantService.getApplicants(params);
    this.loading = false;
  }

  ngOnDestroy() {
    this.applicantsSub.unsubscribe();
  }
}
