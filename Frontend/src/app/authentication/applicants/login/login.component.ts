import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class ApplicantLoginComponent {

  constructor(private fb: FormBuilder) { }

  applicantLoginForm = this.fb.group({
    applicantEmail: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.email])],
    applicantPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
  })


  onApplicantLogin() {
    console.log(this.applicantLoginForm.value);

    if (this.applicantLoginForm.valid) {
      this.applicantLoginForm.reset()
    }
  }

}
