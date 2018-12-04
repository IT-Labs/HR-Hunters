import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  role = {
    applicant: false,
    client: false,
    admin: true
  }

  
  authError;
  private authErrorStatusSub: Subscription;
  private roleStatusSub: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.role === undefined) {
      this.role = {
        applicant: false,
        client: false,
        admin: true
      }
    }
    const currentRole = this.authService.getRole();
    if (currentRole) {
      if (!currentRole.admin && (currentRole.applicant || currentRole.client)) {
        this.role = this.authService.getRole();
      } else {
        this.role = {
          applicant: false,
          client: false,
          admin: true
        }
      }
    }

    this.authErrorStatusSub = this.authService.getAuthErrorStatusListener().subscribe(error => {
      this.authError = error.email;
    })
  }

  loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
  })

  onLogin() {

    if (this.loginForm.invalid) {
      return
    }
    this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  ngOnDestroy() {
    this.authErrorStatusSub.unsubscribe();
  }
}
