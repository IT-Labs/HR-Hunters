import { Component, OnInit, OnDestroy } from "@angular/core";
import { Applicant } from "src/app/models/applicant.model";
import { Subscription } from "rxjs";
import { ApplicantService } from "src/app/services/applicant.service";

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
    previousPage: 0,
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
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}`;
  }

  buildApplicantDataOnUpdate(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    photo: File | string,
    phoneNumber: string
  ) {
    let applicantData: Applicant | FormData;
    if (typeof photo === "object") {
      applicantData = new FormData();
      applicantData.append("id", id.toString());
      applicantData.append("email", email);
      applicantData.append("firstName", firstName);
      applicantData.append("lastName", lastName);
      applicantData.append("photo", photo);
      applicantData.append("phoneNumber", phoneNumber);
    } else {
      applicantData = {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        photo: photo,
        phoneNumber: phoneNumber
      };
    }
  }

  onChangedPage(page: number) {
    if (this.applicantsQP.currentPage !== this.applicantsQP.previousPage) {
      this.applicantsQP.previousPage = this.applicantsQP.currentPage;
      const params = this.buildQueryParams(this.applicantsQP);
      this.applicantService.getApplicants(params);
    }
  }

  onSort(sortBy: any) {
    if (this.applicantsQP.lastSortBy === sortBy) {
      if (this.applicantsQP.currentSortDirection === 1) {
        this.applicantsQP.currentSortDirection = 0;
      } else if (this.applicantsQP.currentSortDirection === 0) {
        this.applicantsQP.currentSortDirection = 1;
      }
      this.applicantsQP.lastSortBy = '';
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
  }

  ngOnDestroy() {
    this.applicantsSub.unsubscribe();
  }
}
