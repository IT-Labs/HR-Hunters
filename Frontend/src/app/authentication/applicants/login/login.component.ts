import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class ApplicantLoginComponent {

  constructor(private fb: FormBuilder) { }

  applicantLoginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })


  onApplicantLogin() {
    console.log(this.applicantLoginForm.value);
  }

}
