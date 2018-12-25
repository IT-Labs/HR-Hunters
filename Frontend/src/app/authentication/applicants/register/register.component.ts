import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { PasswordValidator } from "../../../validators/password.validator";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ApplicantRegisterComponent implements OnInit {
  authError: string;
  strongPassword = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  validText = new RegExp("^([a-zA-Z0-9]|[- @.#&!',_])*$");

  loading = false;

  private authStatusSub: Subscription;
  private authErrorStatusSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.applicantRegisterForm.controls.applicantPassword.valueChanges.subscribe(
      x =>
        this.applicantRegisterForm.controls.applicantConfirmPassword.updateValueAndValidity()
    );
    this.loading = false;
  }

  applicantRegisterForm = this.fb.group({
    applicantFirstName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.validText)
      ])
    ],
    applicantLastName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.validText)
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
      Validators.compose([Validators.required, PasswordValidator])
    ]
  });

  onApplicantRegister() {
    this.loading = true;
    if (this.applicantRegisterForm.invalid) {
      return;
    }

    let applicantData = {
      firstName: this.applicantRegisterForm.value.applicantFirstName,
      lastName: this.applicantRegisterForm.value.applicantLastName,
      email: this.applicantRegisterForm.value.applicantEmail,
      password: this.applicantRegisterForm.value.applicantPassword,
      userType: 1
    };

    this.authService.registerUser(applicantData).subscribe(
      response => {
        this.router.navigate(["/login"]);
        this.loading = false;
        this.toastr.success("", "You've registered successfully!");
      },
      error => {
        if (!!error.error.errors) {
          this.authError = error.error.errors.Error[0];
        }
        this.loading = false;
      }
    );
  }
}
