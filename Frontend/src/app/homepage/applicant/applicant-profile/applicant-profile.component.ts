import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { mimeType } from "../../../validators/mime-type.validator";
import { AuthService } from "src/app/services/auth.service";
import { ApplicantService } from "src/app/services/applicant.service";

@Component({
  selector: "app-applicant-profile",
  templateUrl: "./applicant-profile.component.html",
  styleUrls: ["./applicant-profile.component.scss"]
})
export class ApplicantProfileComponent implements OnInit {
  education = [
    "Highschool",
    "Bachelor",
    "Master",
    "Doctor",
    "Select education level..."
  ];
  loggedInUser;
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
    "20+",
    "Select experience..."
  ];

  validExperience: boolean;
  validPhonenumber = new RegExp(
    "^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$"
  );
  //ex: format: +61 01 2345 6789

  constructor(
    private fb: FormBuilder,
    private applicantService: ApplicantService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.imagePreview =
      "http://droidlessons.com/wp-content/uploads/2017/05/person-1824144_960_720-e1494184045144.png";

    this.loggedInUser = this.authService.getUser();
  }

  applicantProfileFormHP = this.fb.group({
    applicantFirstName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9]*")
      ])
    ],
    applicantLastName: [
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
    phonenumber: [
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern(this.validPhonenumber)
      ])
    ],
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
    ]
  });

  buildApplicantDataOnUpdateApplicantProfile(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    educationType: string,
    schoolUniversity: string,
    experience: string
  ) {
    const newApplicantData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      educationType: educationType,
      schoolUniversity: schoolUniversity,
      experience: experience
    };
    return newApplicantData;
  }

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

  onSubmitApplicantProfile() {
    this.applicantProfileFormHP.controls["applicantFirstName"].markAsTouched();
    this.applicantProfileFormHP.controls["applicantLastName"].markAsTouched();
    this.applicantProfileFormHP.controls["applicantEmail"].markAsTouched();
    this.applicantProfileFormHP.controls["phonenumber"].markAsTouched();
    this.applicantProfileFormHP.controls["education"].markAsTouched();
    this.applicantProfileFormHP.controls["school"].markAsTouched();
    this.applicantProfileFormHP.controls["experience"].markAsTouched();

    let applicantData = this.buildApplicantDataOnUpdateApplicantProfile(
      this.applicantProfileFormHP.value.firstName,
      this.applicantProfileFormHP.value.lastName,
      this.applicantProfileFormHP.value.email,
      this.applicantProfileFormHP.value.phoneNumber,
      this.applicantProfileFormHP.value.education,
      this.applicantProfileFormHP.value.school,
      this.applicantProfileFormHP.value.experience
    );

    if (this.imagePreview === undefined) {
      this.imageValid = false;
    } else {
      if (this.applicantProfileFormHP.valid) {
        this.applicantService.updateApplicant(applicantData, this.loggedInUser.id);
      }
    }
  }
}
