import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class ApplicantRegisterComponent{

  constructor(private fb: FormBuilder) { }

  applicantRegisterForm = this.fb.group({
    applicantFullName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')])],
    applicantEmail: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.email])],
    applicantPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
    applicantConfirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
  })


  onApplicantRegister() {
    console.log(this.applicantRegisterForm.value);

    if (this.applicantRegisterForm.valid) {
      this.applicantRegisterForm.reset()
    }
  }

}
