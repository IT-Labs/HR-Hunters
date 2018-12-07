import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ApplicantRegisterComponent implements OnInit {
  authError: string;
  strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  validEmail = new RegExp("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
  private authStatusSub: Subscription;
  private authErrorStatusSub: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
    this.authErrorStatusSub = this.authService.getAuthErrorStatusListener().subscribe(error => {
      this.authError = error.error
    })

    this.applicantRegisterForm.controls.applicantPassword.valueChanges.subscribe(
      x => this.applicantRegisterForm.controls.applicantConfirmPassword.updateValueAndValidity()
    );
  }

  applicantRegisterForm = this.fb.group({
    applicantFirstName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern("[a-zA-Z ]*")
      ])
    ],
    applicantLastName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern("[a-zA-Z ]*")
      ])
    ],
    applicantEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ],
    applicantPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.strongPassword)
      ])
    ],
    applicantConfirmPassword: [
      "",
      Validators.compose([
        Validators.required,
        PasswordValidator
      ])
    ]
  });
  
  onApplicantRegister() {

    if (this.applicantRegisterForm.invalid) {
      return;
    }

    this.authService.registerUser( null, this.applicantRegisterForm.value.applicantFirstName,
      this.applicantRegisterForm.value.applicantLastName,
      this.applicantRegisterForm.value.applicantEmail,
      this.applicantRegisterForm.value.applicantPassword, 0
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.authErrorStatusSub.unsubscribe();
  }
}
