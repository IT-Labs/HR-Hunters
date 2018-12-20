import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { PasswordValidator } from "../../../validators/password.validator";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
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
  private authErrorStatusSub: Subscription;
  private authStatusSub: Subscription;

  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
    this.authErrorStatusSub = this.authService
      .getAuthErrorStatusListener()
      .subscribe(error => {
        if (error) {
          this.authError = error.error;
        }
      });

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

    this.authService.registerUser(
      this.clientRegisterForm.value.clientName,
      null,
      null,
      this.clientRegisterForm.value.clientEmail,
      this.clientRegisterForm.value.clientPassword,
      2
    );
    this.loading = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.authErrorStatusSub.unsubscribe();
  }
}
