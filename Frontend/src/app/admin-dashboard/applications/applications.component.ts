import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Application } from "src/app/models/application.model";
import { ApplicationService } from "src/app/services/application.service";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-ad-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"]
})
export class ADApplicationsComponent implements OnInit, OnDestroy {
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

  private applicationsSub: Subscription;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService.getApplications(params);
    this.applicationsSub = this.applicationService
      .getApplicationsUpdateListener()
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.applicationsCount;
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.hired = applicationsData.hired;
        this.applicationCount.rejected = applicationsData.rejected;
        this.loading = false;
      });
    setTimeout(() => {
      this.paginationMaxSize = this.applicationCount.all;
    }, 1000);
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

  buildApplicationsDataOnUpdate(id: number, status: string) {
    let applicationData = {
      id: id,
      status: status
    };
    return applicationData;
  }

  onChangedPage(page: number) {
    this.loading = true;
    if (this.applicationQP.currentPage !== this.applicationQP.previousPage) {
      this.applicationQP.previousPage = this.applicationQP.currentPage;
      const params = this.buildQueryParams(this.applicationQP);
      this.applicationService.getApplications(params);
    }
    this.loading = false;
  }

  onFilter(filterBy: string) {
    this.loading = true;
    if (filterBy === null) {
      this.applicationQP.currentFilter = null;
    } else {
      this.applicationQP.currentFilter = "status";
    }

    // CALCULATE PAGINATION
    if (filterBy === null) {
      this.paginationMaxSize = this.applicationCount.all;
    } else if (filterBy === "Pending") {
      this.paginationMaxSize = this.applicationCount.pending;
    } else if (filterBy === "Contacted") {
      this.paginationMaxSize = this.applicationCount.contacted;
    } else if (filterBy === "Interviewed") {
      this.paginationMaxSize = this.applicationCount.interviewed;
    } else if (filterBy === "Hired") {
      this.paginationMaxSize = this.applicationCount.hired;
    } else if (filterBy === "Rejected") {
      this.paginationMaxSize = this.applicationCount.rejected;
    }

    this.applicationQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService.getApplications(params);
    this.loading = false;
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
    this.applicationService.getApplications(params);
  }

  chooseStatus(event: any, id: number) {
    this.loading = true;
    const currentStatus = event.target.innerText;
    const currentId = id;
    const applicationData = this.buildApplicationsDataOnUpdate(
      currentId,
      currentStatus
    );
    this.applicationService.updateApplication(applicationData);

    setTimeout(() => {
      const params = this.buildQueryParams(this.applicationQP);
      this.applicationService.getApplications(params);
      this.loading = false;
      this.toastrService.success('', 'Status changed successfully!');
    }, 1000);
  }

  ngOnDestroy() {
    this.applicationsSub.unsubscribe();
  }
}
