import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {

  private userIsAuthenticated = false;
  private authStatusSub: Subscription;

  loading = false;
  loggedInUser;
  role = 3;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();

    if (this.loggedInUser !== null) {
      if (this.loggedInUser.role === 1) {
        this.router.navigate(['/applicant/job-postings'])
        return
      } else if (this.loggedInUser.role === 2) {
        this.router.navigate(['/client/job-postings'])
        return
      } else if (this.loggedInUser.role === 3) {
        this.router.navigate(['/admin-dashboard/job-postings'])
        return
      }
    }

    this.loading = false;
  }

  onSelectRole(role: number) {
    this.role = role;
    this.authService.selectRole(this.role)
  }
}
