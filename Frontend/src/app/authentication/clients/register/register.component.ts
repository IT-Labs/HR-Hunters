import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ClientRegisterComponent {
  password: string;
  confirmedPassword: string;

  constructor(private fb: FormBuilder) {}

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

    if (this.clientRegisterForm.valid) {
      this.clientRegisterForm.reset();
    }
  }
}
