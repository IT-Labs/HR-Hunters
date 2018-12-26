import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent {

  loading = false;
  role = 3;
  loggedInUser;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedInUser = this.authService.getUser();

    if (this.loggedInUser !== null) {
      if (this.loggedInUser.role === 1) {
        this.router.navigate(["/applicant/job-postings"]);
        return;
      } else if (this.loggedInUser.role === 2) {
        this.router.navigate(["/client/job-postings"]);
        return;
      } else if (this.loggedInUser.role === 3) {
        this.router.navigate(["/admin-dashboard/job-postings"]);
        return;
      }
    }
  }

  onSelectRole(role: number) {
    this.role = role;
    this.authService.selectRole(this.role)
  }
}
