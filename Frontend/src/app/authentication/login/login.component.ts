import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  role = 3;
  loading = false;
  authError;
  loggedInUser = null;

  private authErrorStatusSub: Subscription;
  private roleStatusSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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

    this.role = this.authService.getRole();
    
    this.authErrorStatusSub = this.authService
      .getAuthErrorStatusListener()
      .subscribe(error => {
        this.authError = error.error;
      });
    this.loading = false;
  }

  loginForm = this.fb.group({
    email: [
      "",
      Validators.compose([
        Validators.required
      ])
    ],
    password: [
      "",
      Validators.compose([
        Validators.required
      ])
    ]
  });

  onLogin() {
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = false;
    this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  ngOnDestroy() {
  }
}
