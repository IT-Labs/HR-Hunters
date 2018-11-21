import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class ClientRegisterComponent {
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

  onClientRegister() {
    console.log(this.clientRegisterForm.value);

    if (this.clientRegisterForm.valid) {
      this.clientRegisterForm.reset();
    }
  }
}
