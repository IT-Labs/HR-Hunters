import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ClientRegisterComponent {
  private password: string;
  private confirmedPassword: string;
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

  clientRegisterForm = this.fb.group({
    clientName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern("[a-zA-Z ]*")
      ])
    ],
    clientEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email
      ])
    ],
    clientPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ])
    ],
    clientConfirmPassword: [
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
  onClientRegister() {
    console.log(this.clientRegisterForm.value);

    if (this.clientRegisterForm.invalid) {
      return;
    }

    this.authService.registerClient(
      this.clientRegisterForm.value.clientName,
      this.clientRegisterForm.value.applicantEmail,
      this.clientRegisterForm.value.applicantPassword
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.registerStatusSub.unsubscribe();
  }
}
