import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { Subscription } from "rxjs";
import { AdminService } from "src/app/services/admin.service";

@Component({
  selector: "app-ad-job-postings",
  templateUrl: "./job-postings.component.html",
  styleUrls: ["./job-postings.component.scss"]
})
export class ADJobPostingsComponent implements OnInit {
  jobPostingsCount = {
    all: 15,
    approved: 10,
    awaitingApproval: 2,
    expired: 3
  };

  selectedTab = {
    jobs: false,
    new: true
  };

  jobPostings: JobPosting[] = [];
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = "Expires";
  currentSortDirection = 1;
  currentFilter = "All";
  private applicationsSub: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit() {}

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
    this.adminService.getApplications(
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
    this.adminService.getApplications(
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
    this.adminService.getApplications(
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
