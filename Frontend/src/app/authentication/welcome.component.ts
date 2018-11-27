import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {

  selectedTab = {
    applicant: false,
    client: false,
    admin: true
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSelectTab(input: string) {
    if (input === "applicant") {
      this.selectedTab.applicant = true;
      this.selectedTab.client = false;
      this.selectedTab.admin = false;
    } else if (input === "client") {
      this.selectedTab.applicant = false;
      this.selectedTab.client = true;
      this.selectedTab.admin = false;
    }

    this.authService.selectRole(this.selectedTab)
  }

  
}
