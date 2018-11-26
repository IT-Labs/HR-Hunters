import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  role = "admin";

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  adminLoginForm = this.fb.group({
    adminEmail: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.email])],
    adminPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
  })

  onAdminLogin() {
    console.log(this.adminLoginForm.value);

    if (this.adminLoginForm.invalid) {
      return
    }
    this.authService.loginUser(
      this.adminLoginForm.value.clientEmail,
      this.adminLoginForm.value.clientPassword,
      this.role
    );
  }
}
