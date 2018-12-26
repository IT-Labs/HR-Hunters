import { Component, OnInit } from "@angular/core";
import { Application } from "src/app/models/application.model";
import { ApplicationService } from "src/app/services/application.service";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-ad-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"]
})
export class ADApplicationsComponent implements OnInit {
  applicationCount = {
    all: 0,
    pending: 0,
    contacted: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0
  };
  applications: Application[] = [];
  paginationMaxSize = 0;

  applicationQP = {
    postsPerPage: 10,
    currentPage: 1,
    previousPage: 0,
    currentSortBy: "postedOn",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: null,
    currentFilterQuery: null
  };
  paginationSize: number[] = [];

  loading = false;
  loggedInUser;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService
      .getApplications(params)
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.maxApplications;
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.hired = applicationsData.hired;
        this.applicationCount.rejected = applicationsData.rejected;

        this.paginationMaxSize = this.applicationCount.all;
        this.loading = false;
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.toastr.error(
            error.error.errors.Error[0],
            "Error occured!"
          );
          this.loading = false;
        }
      });
  }

  buildQueryParams(data) {
    if (data.currentFilter === null) {
      return `?pageSize=${data.postsPerPage}&currentPage=${
        data.currentPage
      }&sortedBy=${data.currentSortBy}&sortDir=${
        data.currentSortDirection
      }&id=${this.loggedInUser.id}`;
    }
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${
      data.currentSortDirection
    }&filterBy=${data.currentFilter}&filterQuery=${
      data.currentFilterQuery
    }&id=${this.loggedInUser.id}`;
  }

  onChangedPage(page: number) {
    this.loading = true;
    if (this.applicationQP.currentPage !== this.applicationQP.previousPage) {
      this.applicationQP.previousPage = this.applicationQP.currentPage;
      const params = this.buildQueryParams(this.applicationQP);
      this.applicationService
        .getApplications(params)
        .subscribe(applicationsData => {
          this.applications = applicationsData.applications;
          this.applicationCount.all = applicationsData.maxApplications;
          this.applicationCount.pending = applicationsData.pending;
          this.applicationCount.contacted = applicationsData.contacted;
          this.applicationCount.interviewed = applicationsData.interviewed;
          this.applicationCount.hired = applicationsData.hired;
          this.applicationCount.rejected = applicationsData.rejected;

          this.paginationMaxSize = this.applicationCount.all;
          this.loading = false;
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            this.loading = false;
            return;
          }
          if (!!error.error.errors) {
            this.toastr.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
            this.loading = false;
          }
        });
    }
  }

  onFilter(filterBy: string) {
    this.loading = true;
    if (filterBy === null) {
      this.applicationQP.currentFilter = null;
    } else {
      this.applicationQP.currentFilter = "status";
    }

    this.applicationQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService
      .getApplications(params)
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.maxApplications;
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.hired = applicationsData.hired;
        this.applicationCount.rejected = applicationsData.rejected;

        // CALCULATE PAGINATION
        if (filterBy === null) {
          this.paginationMaxSize = applicationsData.maxApplications;
        } else if (filterBy === "Pending") {
          this.paginationMaxSize = applicationsData.pending;
        } else if (filterBy === "Contacted") {
          this.paginationMaxSize = applicationsData.contacted;
        } else if (filterBy === "Interviewed") {
          this.paginationMaxSize = applicationsData.interviewed;
        } else if (filterBy === "Hired") {
          this.paginationMaxSize = applicationsData.hired;
        } else if (filterBy === "Rejected") {
          this.paginationMaxSize = applicationsData.rejected;
        }
        this.loading = false;
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.toastr.error(
            error.error.errors.Error[0],
            "Error occured!"
          );
          this.loading = false;
        }
      });
  }

  onSort(sortBy: string) {
    if (this.applicationQP.lastSortBy === sortBy) {
      if (this.applicationQP.currentSortDirection === 1) {
        this.applicationQP.currentSortDirection = 0;
      } else if (this.applicationQP.currentSortDirection === 0) {
        this.applicationQP.currentSortDirection = 1;
      }
      this.applicationQP.lastSortBy = "";
    } else if (this.applicationQP.lastSortBy !== sortBy) {
      if (this.applicationQP.currentSortDirection === 1) {
        this.applicationQP.currentSortDirection = 0;
      } else if (this.applicationQP.currentSortDirection === 0) {
        this.applicationQP.currentSortDirection = 1;
      }
      this.applicationQP.lastSortBy = sortBy;
    }
    this.applicationQP.currentSortBy = sortBy;

    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService
      .getApplications(params)
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.maxApplications;
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.hired = applicationsData.hired;
        this.applicationCount.rejected = applicationsData.rejected;

        this.paginationMaxSize = this.applicationCount.all;
        this.loading = false;
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.toastr.error(
            error.error.errors.Error[0],
            "Error occured!"
          );
          this.loading = false;
        }
      });
  }

  chooseStatus(event: any, id: number) {
    this.loading = true;
    const currentStatus = {
      status: event.target.innerText
    };
    const currentId = id;
    this.applicationService
      .updateApplication(currentStatus, currentId)
      .subscribe(
        response => {
          const params = this.buildQueryParams(this.applicationQP);
          this.applicationService.getApplications(params).subscribe(
            applicationsData => {
              this.applications = applicationsData.applications;
              this.applicationCount.all = applicationsData.maxApplications;
              this.applicationCount.pending = applicationsData.pending;
              this.applicationCount.contacted = applicationsData.contacted;
              this.applicationCount.interviewed = applicationsData.interviewed;
              this.applicationCount.hired = applicationsData.hired;
              this.applicationCount.rejected = applicationsData.rejected;

              this.paginationMaxSize = this.applicationCount.all;
              this.toastr.success(
                "",
                "Application status updated successfully!"
              );
              this.loading = false;
            },
            error => {
              if (error.status == 401) {
                this.authService.logout();
                this.loading = false;
                return;
              }
              if (!!error.error.errors) {
                this.toastr.error(
                  error.error.errors.Error[0],
                  "Error occured!"
                );
                this.loading = false;
              }
            }
          );
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            this.loading = false;
            return;
          }
          if (!!error.error.errors) {
            this.toastr.error(error.error.errors.Error[0], "Error occured!");
            this.loading = false;
          }
        }
      );
  }
}
