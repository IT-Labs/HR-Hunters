import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  loggedInUser;

  constructor(
    public http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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

  public ping() {
    this.http
      .get("")
      .subscribe(data => console.log(data), err => console.log(err));
  }
}
