import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class ApplicantLoginComponent {
  role = "applicant";
  private authStatusSub: Subscription;
  
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
  }
  
  applicantLoginForm = this.fb.group({
    applicantEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email
      ])
    ],
    applicantPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ])
    ]
  });

  onApplicantLogin() {
    console.log(this.applicantLoginForm.value);

    if (this.applicantLoginForm.invalid) {
      return
    }
    this.authService.loginUser(
      this.applicantLoginForm.value.clientEmail,
      this.applicantLoginForm.value.clientPassword,
      this.role
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
