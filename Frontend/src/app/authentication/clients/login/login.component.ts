import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class ClientLoginComponent {
  role = "client";
  private authStatusSub: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
  }

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

    if (this.clientLoginForm.invalid) {
      return
    }
    this.authService.loginUser(
      this.clientLoginForm.value.clientEmail,
      this.clientLoginForm.value.clientPassword,
      this.role
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
