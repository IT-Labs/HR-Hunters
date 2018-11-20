import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { Subscription } from "rxjs";
import { Application } from "src/app/models/application.model";

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"]
})
export class ApplicationsComponent implements OnInit {

  dummyData: Application[] = [
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
    {
      id: "1",
      applicantEmail: 'mail',
      applicantName: 'Ivo',
      experience: 1,
      jobTitle: 'Front',
      postedOn: Date.now(),
      status: "Pending"
    }
  ]

  totalApplications = 0;
  applications: Application[] = [];
  postsPerPage = 2;
  currentPage = 1;
  currentStatus = "Pending";
  private applicationsSub: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getApplications(10, 0);
    this.adminService
      .getApplicationsUpdateListener()
      .subscribe(
        (applicationsData: {
          applications: Application[];
          applicationsCount: number;
        }) => {
          this.totalApplications = applicationsData.applicationsCount;
          this.applications = applicationsData.applications;
        }
      );
  }

  chooseStatus(event: any) {
    const currentStatus = event.target.innerText;
    // const statuses = [
    //   "pending",
    //   "contacted",
    //   "interviewed",
    //   "hired",
    //   "rejected"
    // ];

    // const status = {
    //   pending: true,
    //   contacted: false,
    //   interviewed: false,
    //   hired: false,
    //   rejected: false
    // };

    // if (currentStatus === status[currentStatus]) {
    //   status[currentStatus] = true;
    // } else {
    //   statuses.map(availableStatus => {
    //     status[availableStatus] = false;
    //   });
    // }

    this.currentStatus = currentStatus;
  }
}
