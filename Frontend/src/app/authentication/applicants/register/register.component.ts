import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ApplicantRegisterComponent implements OnInit {
  password: string;
  confirmedPassword: string;
  registrationError;
  private authStatusSub: Subscription;
  private registerStatusSub: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
    this.registerStatusSub = this.authService.getRegisterStatusListener().subscribe(error => {
      this.registrationError = error;
    })
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
    ],
    applicantConfirmPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ])
    ]
  });

  updatePassword(event: any) {
    if (event.target.value) {
      this.password = event.target.value;
    }
  }

  updateConfirmedPassword(event: any) {
    if (event.target.value !== undefined) {
      this.confirmedPassword = event.target.value;
    }
  }

  comparePasswords() {
    if (this.password === this.confirmedPassword) {
      return true;
    }
    return false;
  }

  onApplicantRegister() {
    console.log(this.applicantRegisterForm.value);

    if (this.applicantRegisterForm.invalid) {
      return;
    }

    this.authService.registerApplicant(
      this.applicantRegisterForm.value.applicantFirstName,
      this.applicantRegisterForm.value.applicantLastName,
      this.applicantRegisterForm.value.applicantEmail,
      this.applicantRegisterForm.value.applicantPassword
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
