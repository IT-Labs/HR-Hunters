import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  role = 3;
  loading = false;
  authError;

  private roleStatusSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();
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

    const authData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this.authService.loginUser(authData).subscribe(
      response => {
          const token = response.token;
          this.authService.user.token = response.token;
          this.authService.user.id = response.id;
          this.authService.user.email = response.email;
          this.authService.user.role = response.role;
          this.authService.user.firstName = response.firstName;
          this.authService.user.lastName = response.lastName;
          if (token) {
            this.authService.saveAuthData(token);
            this.authService.saveUserData(JSON.stringify(this.authService.user));
            if (response.role === 1) {
              if (response.newUser) {
                this.router.navigate(["/applicant/profile"]);
              } else if (!response.newUser) {
                this.router.navigate(["/applicant/job-postings"]);
              }
            } else if (response.role === 2) {
              if (response.newUser) {
                this.router.navigate(["/client/profile"]);
              } else if (!response.newUser) {
                this.router.navigate(["/client/job-postings"]);
              }
            } else if (response.role === 3) {
              this.router.navigate(["/admin-dashboard/job-postings"]);
            }
          }
          this.loading = false;
          this.toastr.success("", "Logged in successfully!");
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.authError = error.error.errors.Error[0]
        }
        this.loading = false;
      }
    );
  }
}
