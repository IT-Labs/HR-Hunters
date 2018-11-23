import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class ClientLoginComponent {
  screenHeight;

  constructor(private fb: FormBuilder) {}

  clientLoginForm = this.fb.group({
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
    ]
  });

  onClientLogin() {
    console.log(this.clientLoginForm.value);

    if (this.clientLoginForm.valid) {
      this.clientLoginForm.reset();
    }
  }

}
