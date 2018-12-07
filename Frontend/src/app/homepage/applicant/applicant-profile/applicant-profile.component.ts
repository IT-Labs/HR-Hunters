import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { mimeType } from "../../../validators/mime-type.validator";

@Component({
  selector: 'app-applicant-profile',
  templateUrl: './applicant-profile.component.html',
  styleUrls: ['./applicant-profile.component.scss']
})
export class ApplicantProfileComponent implements OnInit {

  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree"
  ];
  imagePreview: string | ArrayBuffer;
  imageValid = true;
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );

  experience = [
    "<1",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20+"
  ];
  filteredExperience = [];

  formFocus = {
    firstName: false,
    applicantEmail: false,
    phonenumber: false,
    education: false,
    school: false,
    experience: false,
    logo: false   
  
  };

  validExperience: boolean;

  // validPhonenumber = new RegExp("^(\+\s?)?((?<!\+.*)\(\+?\d+([\s\-\.]?\d+)?\)|\d+)([\s\-\.]?(\(\d+([\s\-\.]?\d+)?\)|\d+))*(\s?(x|ext\.?)\s?\d+)?$");
  // validPhonenumber = new RegExp("/^(?:\+\d{2})?\d{10}(?:,(?:\+\d{2})?\d{10})*$/");
   validPhonenumber = new RegExp("/^[a-zA-Z0-9\-().\s]{10,15}$/");

  

 
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.imagePreview = 'http://droidlessons.com/wp-content/uploads/2017/05/person-1824144_960_720-e1494184045144.png';
  }

  applicantProfileFormHP = this.fb.group({
    firstName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9]*")
      ])
    ],
    lastName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9]*")
      ])
    ],
    applicantEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ],

    phonenumber: ["", Validators.compose([Validators.required,Validators.pattern(this.validPhonenumber)])],
    education: ["", Validators.compose([Validators.required])],
    school: ["", Validators.compose([Validators.required])],
    experience: [
      "",
      Validators.compose([Validators.required, Validators.maxLength(3)])
    ],

    
    logo: [
      "",
      {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
    ],
  
  });

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let img = new Image();
      img.src = reader.result.toString();
      setTimeout(() => {
        if (img.height < 600 || img.width < 600) {
          this.applicantProfileFormHP.patchValue({ logo: file });
          this.applicantProfileFormHP.controls["logo"].updateValueAndValidity();
          this.imagePreview = reader.result;
          this.imageValid = true;
        } else {
          this.imageValid = false;
        }
      }, 1000);
    };
    reader.readAsDataURL(file);
  }

  onFocus(event: any) {
    // this.formFocus = {
    //   firstName: false,
    //   applicantEmail: false,
    //   logo: false,
    //   phonenumber: false,
    //   education: false,
    //   experience: false,
    // };
    this.formFocus[event] = true;
  }

  populateExperienceSuggestions(event: any) {
    this.filteredExperience = [];
    this.experience.map(num => {
      if (num.includes(event.target.value)) {
        this.filteredExperience.push(num);
      }
    });
  }

  checkExperience() {
    for (let i = 0; i < this.experience.length; i++) {
      if (
        this.experience[i] ==
        this.applicantProfileFormHP.controls["experience"].value
      ) {
        return true;
      }
    }
    return false;
  }
  onSubmitApplicantProfile() {

    this.validExperience = this.checkExperience();

    this.applicantProfileFormHP.controls["firstName"].markAsTouched();
    this.applicantProfileFormHP.controls["applicantEmail"].markAsTouched();
    this.applicantProfileFormHP.controls["phonenumber"].markAsTouched();
    this.applicantProfileFormHP.controls["logo"].markAsTouched();
      if (this.imagePreview === undefined) {
      this.imageValid = false;
    } else {
      if (this.applicantProfileFormHP.valid) {
        console.log('something')
      }
    }
  }

}
