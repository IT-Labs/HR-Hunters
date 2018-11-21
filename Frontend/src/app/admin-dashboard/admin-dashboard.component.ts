import { Component } from "@angular/core";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"]
})
export class AdminDashboardComponent {
  
  selectedTab = {
    jobs: true,
    applications: false,
    clients: false,
    applicants: false
  };

  constructor() {}

  onChangeTab(event: string) {
    if (event === "jobs") {
      this.selectedTab.jobs = true;
      this.selectedTab.applications = false;
      this.selectedTab.clients = false;
      this.selectedTab.applicants = false;
    } else if (event === "applications") {
      this.selectedTab.jobs = false;
      this.selectedTab.applications = true;
      this.selectedTab.clients = false;
      this.selectedTab.applicants = false;
    } else if (event === "clients") {
      this.selectedTab.jobs = false;
      this.selectedTab.applications = false;
      this.selectedTab.clients = true;
      this.selectedTab.applicants = false;
    } else if (event === "applicants") {
      this.selectedTab.jobs = false;
      this.selectedTab.applications = false;
      this.selectedTab.clients = false;
      this.selectedTab.applicants = true;
    }
  }
}
