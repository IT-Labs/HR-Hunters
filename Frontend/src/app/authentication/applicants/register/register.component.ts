import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ApplicantRegisterComponent {
  password: string;
  confirmedPassword: string;

  constructor(private fb: FormBuilder) {}

  applicantRegisterForm = this.fb.group({
    applicantFullName: [
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

    if (this.applicantRegisterForm.valid) {
      this.applicantRegisterForm.reset();
    }
  }
}
