import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { PasswordValidator } from "../../../validators/password.validator";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html"
})
export class ClientRegisterComponent {
  authError: string;
  strongPassword = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  validText = new RegExp("^([a-zA-Z0-9]|[- @.#&!',_])*$");
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.clientRegisterForm.controls.clientPassword.valueChanges.subscribe(x =>
      this.clientRegisterForm.controls.clientConfirmPassword.updateValueAndValidity()
    );

    this.loading = false;
  }

  clientRegisterForm = this.fb.group({
    clientName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(this.validText)
      ])
    ],
    clientEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ],
    clientPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.strongPassword)
      ])
    ],
    clientConfirmPassword: [
      "",
      Validators.compose([Validators.required, PasswordValidator])
    ]
  });

  onClientRegister() {
    this.loading = true;
    if (this.clientRegisterForm.invalid) {
      return;
    }

    let clientData = {
      firstName: this.clientRegisterForm.value.clientName,
      lastName: null,
      email: this.clientRegisterForm.value.clientEmail,
      password: this.clientRegisterForm.value.clientPassword,
      userType: 2
    };

    this.authService.registerUser(clientData).subscribe(
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
