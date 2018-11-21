import { Component, OnInit, OnDestroy } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { Subscription } from "rxjs";
import { Application } from "src/app/models/application.model";

@Component({
  selector: "app-ad-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"]
})
export class ADApplicationsComponent implements OnInit, OnDestroy {

  dummyData: Application[] = [
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Kire',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now().toString(),
      status: "Pending"
    },
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Pero',
      experience: 9,
      jobTitle: 'Front',
      postedOn: Date.now().toString(),
      status: "Hired"
    },
    {
      id: "1",
      applicantEmail: 'ivo@mail.com',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Frontend',
      postedOn: Date.now().toString(),
      status: "Interviewed"
    },
    {
      id: "1",
      applicantEmail: 'tijana@mail.com',
      applicantName: 'Tijana',
      experience: 2,
      jobTitle: 'Frontend',
      postedOn: Date.now().toString(),
      status: "Pending"
    },
    {
      id: "1",
      applicantEmail: 'tome@mail.com',
      applicantName: 'Tome',
      experience: 1,
      jobTitle: 'Backend',
      postedOn: Date.now().toString(),
      status: "Pending"
    },
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Draga',
      experience: 1,
      jobTitle: 'QA',
      postedOn: Date.now().toString(),
      status: "Contacted"
    },
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Marko',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now().toString(),
      status: "Pending"
    },
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Viktor',
      experience: 3,
      jobTitle: 'Front',
      postedOn: Date.now().toString(),
      status: "Rejected"
    },
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'David',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now().toString(),
      status: "Rejected"
    },
    {
      id: "1",
      applicantEmail: 'vlatko@mail.com',
      applicantName: 'Vlatko',
      experience: 2,
      jobTitle: 'Backend',
      postedOn: Date.now().toString(),
      status: "Pending"
    }
  ]

  totalApplications = 11;
  applications: Application[] = [];
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = 'Posted';
  currentSortDirection = "Ascending"
  currentFilter = "All";
  private applicationsSub: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    // this.adminService.getApplications(this.postsPerPage, this.currentPage, this.currentSortBy, this.currentSortDirection, this.currentFilter);
    // this.adminService
    //   .getApplicationsUpdateListener()
    //   .subscribe(
    //     (applicationsData: {
    //       applications: Application[];
    //       applicationsCount: number;
    //     }) => {
    //       this.totalApplications = applicationsData.applicationsCount;
    //       this.applications = applicationsData.applications;
    //     }
    //   );
  }

  onChangedPage(pageData: any) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.adminService.getApplications(this.postsPerPage, this.currentPage, this.currentSortBy, this.currentSortDirection, this.currentFilter);
  }

  chooseStatus(event: any) {
    const currentStatus = event.target.innerText;
  }

  ngOnDestroy() {
    // this.applicationsSub.unsubscribe();
  }
}
