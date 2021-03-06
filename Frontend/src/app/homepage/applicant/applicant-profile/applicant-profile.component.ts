import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { mimeType } from "../../../validators/mime-type.validator";
import { AuthService } from "src/app/services/auth.service";
import { ApplicantService } from "src/app/services/applicant.service";
import { Applicant } from "src/app/models/applicant.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
    "Doctoral",
    "Select education level..."
  ];
  applicantError;
  loggedInUser;
  loggedInApplicant: Applicant = {
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    photo: null,
    education: null,
    experience: null,
    school: null
  };
  imagePreview: string | ArrayBuffer;
  defaultImage = "https://i.ibb.co/Rg5Rhpq/avatar.jpg";
  imageValid = true;
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  validText = new RegExp("^([a-zA-Z0-9]|[- @.#&!',_])*$");
  loading = false;
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

  constructor(
    private fb: FormBuilder,
    private applicantService: ApplicantService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    this.applicantService.getApplicant(this.loggedInUser.id).subscribe(
      applicantProfile => {
        this.loggedInApplicant = applicantProfile;
        this.applicantProfileFormHP.controls.applicantFirstName.setValue(
          applicantProfile.firstName
        );
        this.applicantProfileFormHP.controls.applicantLastName.setValue(
          applicantProfile.lastName
        );
        this.applicantProfileFormHP.controls.applicantEmail.setValue(
          applicantProfile.email
        );
        this.applicantProfileFormHP.controls.phonenumber.setValue(
          applicantProfile.phoneNumber
        );
        this.applicantProfileFormHP.controls.education.setValue(
          applicantProfile.education
        );
        this.applicantProfileFormHP.controls.school.setValue(
          applicantProfile.school
        );
        this.applicantProfileFormHP.controls.experience.setValue(
          applicantProfile.experience
        );
        if (applicantProfile.photo !== "") {
          this.imagePreview = applicantProfile.photo;
        } else {
          this.imagePreview = this.defaultImage;
        }
        this.loading = false;
      },
      error => {
        this.applicantError = error.error;
      }
    );
  }

  applicantProfileFormHP = this.fb.group({
    applicantFirstName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.validText)
      ])
    ],
    applicantLastName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.validText)
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
    phonenumber: ["", Validators.compose([Validators.required])],
    education: ["", Validators.compose([Validators.required])],
    school: [
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern(this.validText)
      ])
    ],
    experience: [
      "",
      Validators.compose([Validators.required, Validators.maxLength(3)])
    ]
  });

  applicantProfileImageFormHP = this.fb.group({
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
    this.loading = true;
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
          this.onSubmitApplicantLogo();
        } else {
          this.imageValid = false;
        }
      }, 1000);
    };
    reader.readAsDataURL(file);
    this.loading = false;
  }

  buildImageFile(logo: any) {
    const logoData = new FormData();
    logoData.append("logo", logo);
    return logoData;
  }

  onSubmitApplicantLogo() {
    this.loading = true;
    this.applicantService
      .uploadApplicantLogo(
        this.loggedInUser.id,
        this.buildImageFile(this.applicantProfileImageFormHP.value.logo)
      )
      .subscribe(response => {
        this.applicantService.getApplicant(this.loggedInUser.id).subscribe(
          applicantProfile => {
            this.loggedInApplicant = applicantProfile;
            this.applicantProfileFormHP.controls.applicantFirstName.setValue(
              applicantProfile.firstName
            );
            this.applicantProfileFormHP.controls.applicantLastName.setValue(
              applicantProfile.lastName
            );
            this.applicantProfileFormHP.controls.applicantEmail.setValue(
              applicantProfile.email
            );
            this.applicantProfileFormHP.controls.phonenumber.setValue(
              applicantProfile.phoneNumber
            );
            this.applicantProfileFormHP.controls.education.setValue(
              applicantProfile.education
            );
            this.applicantProfileFormHP.controls.school.setValue(
              applicantProfile.school
            );
            this.applicantProfileFormHP.controls.experience.setValue(
              applicantProfile.experience
            );
            if (applicantProfile.photo !== "") {
              this.imagePreview = applicantProfile.photo;
            } else {
              this.imagePreview = this.defaultImage;
            }
            this.loading = false;
          },
          error => {
            this.applicantError = error.error;
          }
        );
      });
  }

  onSubmitApplicantProfile() {
    this.loading = true;
    this.applicantProfileFormHP.controls["applicantFirstName"].markAsTouched();
    this.applicantProfileFormHP.controls["applicantLastName"].markAsTouched();
    this.applicantProfileFormHP.controls["applicantEmail"].markAsTouched();
    this.applicantProfileFormHP.controls["phonenumber"].markAsTouched();
    this.applicantProfileFormHP.controls["education"].markAsTouched();
    this.applicantProfileFormHP.controls["school"].markAsTouched();
    this.applicantProfileFormHP.controls["experience"].markAsTouched();

    let applicantData = this.buildApplicantDataOnUpdateApplicantProfile(
      this.applicantProfileFormHP.value.applicantFirstName,
      this.applicantProfileFormHP.value.applicantLastName,
      this.applicantProfileFormHP.value.applicantEmail,
      this.applicantProfileFormHP.value.phonenumber,
      this.applicantProfileFormHP.value.education,
      this.applicantProfileFormHP.value.school,
      this.applicantProfileFormHP.value.experience
    );

    if (this.applicantProfileFormHP.valid) {
      this.applicantService
        .updateApplicant(applicantData, this.loggedInUser.id)
        .subscribe(
          response => {
            this.router.navigate(["/admin-dashboard/applicants"]);
            this.toastr.success("", "Profile was successfully updated!");
          },
          error => {
            if (error.status == 401) {
              this.authService.logout();
              return;
            }
            if (!!error.error.errors) {
              this.toastr.error(
                error.error.errors.Error[0],
                "Error occured!"
              );
            }
          }
        );
    }
    this.loading = false;
  }
}
