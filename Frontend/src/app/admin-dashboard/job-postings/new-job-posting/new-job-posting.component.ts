import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Client } from "src/app/models/client.model";
import { mimeType } from "../../../validators/mime-type.validator";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-ad-new-job-posting",
  templateUrl: "./new-job-posting.component.html",
  styleUrls: ["./new-job-posting.component.scss"]
})
export class ADNewJobPostingComponent implements OnInit {
  jobTypes = ["Full-time", "Part-time", "Intership", "Select job type..."];
  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree",
    "Select education level..."
  ];

  existingCompany = false;
  validDates: boolean;
  // validExperience: boolean;

  imagePreview: string | ArrayBuffer;
  imageValid = true;
  filteredCompanies: Client[] = [];
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
  filteredExperience = [];
  companies: Client[] = [];
  selectedCompany: Client = {
    id: null,
    email: null,
    companyName: null,
    activeJobs: null,
    allJobs: null,
    logo: null,
    status: null,
    location: null
  };
  formFocus = {
    companyName: false,
    companyEmail: false,
    logo: false,
    title: false,
    description: false,
    jobType: false,
    education: false,
    experience: false,
    durationFrom: false,
    durationTo: false
  };

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredCompanies = this.companies;
    this.filteredExperience = this.experience.slice();
  }

  newJobPostingForm = this.fb.group({
    companyName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ])
    ],
    companyEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email
      ])
    ],
    location: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])
    ],
    logo: [
      "",
      {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
    ],
    title: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])
    ],
    description: ["", Validators.compose([Validators.maxLength(300)])],
    jobType: ["", Validators.compose([Validators.required])],
    education: ["", Validators.compose([Validators.required])],
    experience: ["", Validators.compose([Validators.required])],
    durationFrom: ["", Validators.compose([Validators.required])],
    durationTo: ["", Validators.compose([Validators.required])]
  });

  onCompanyRadioBtnClick(company: string) {
    if (company === "existing") {
      this.existingCompany = true;
      this.newJobPostingForm.controls["companyEmail"].disable();
      this.newJobPostingForm.controls["location"].disable();
      this.newJobPostingForm.controls["logo"].disable();
    } else if (company === "new") {
      this.existingCompany = false;
      this.newJobPostingForm.controls["companyEmail"].enable();
      this.newJobPostingForm.controls["location"].enable();
      this.newJobPostingForm.controls["logo"].enable();
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let img = new Image();
      img.src = reader.result.toString();
      setTimeout(() => {
        if (img.height < 600 || img.width < 600) {
          this.newJobPostingForm.patchValue({ logo: file });
          this.newJobPostingForm.controls["logo"].updateValueAndValidity();
          this.imagePreview = reader.result;
          this.imageValid = true;
        } else {
          this.imageValid = false;
        }
      }, 1000);
    };
    reader.readAsDataURL(file);
  }

  compareTwoDates() {
    if (
      new Date(this.newJobPostingForm.controls["durationFrom"].value) >=
      new Date(this.newJobPostingForm.controls["durationTo"].value)
    ) {
      return false;
    }
    return true;
  }

  // checkExperience() {
  //   for (let i = 0; i < this.experience.length; i++) {
  //     if (
  //       this.experience[i] ==
  //       this.newJobPostingForm.controls["experience"].value
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  onFocus(event: any) {
    this.formFocus = {
      companyName: false,
      companyEmail: false,
      logo: false,
      title: false,
      description: false,
      jobType: false,
      education: false,
      experience: false,
      durationFrom: false,
      durationTo: false
    };
    this.formFocus[event] = true;
  }

  populateCompanyInfo(event: any) {
    this.onFocus("none");
    const companyName = event.target.innerText;
    this.companies.map(company => {
      if (company.companyName === companyName) {
        this.selectedCompany = company;
        this.newJobPostingForm.controls["companyName"].setValue(
          this.selectedCompany.companyName
        );
        this.newJobPostingForm.controls["companyEmail"].setValue(
          this.selectedCompany.email
        );
        this.newJobPostingForm.controls["location"].setValue(
          this.selectedCompany.location
        );
      }
    });
  }
  // populateExperience(event: any) {
  //   this.onFocus("none");
  //   const experience = event.target.innerText;
  //   this.experience.map(num => {
  //     if (num === experience) {
  //       this.newJobPostingForm.controls["experience"].setValue(experience);
  //     }
  //   });
  // }

  populateCompanySuggestions(event: any) {
    this.filteredCompanies = [];
    this.companies.filter(company => {
      if (
        company.companyName
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.filteredCompanies.push(company);
      }
    });
  }

  // populateExperienceSuggestions(event: any) {
  //   this.filteredExperience = [];
  //   this.experience.map(num => {
  //     if (num.includes(event.target.value)) {
  //       this.filteredExperience.push(num);
  //     }
  //   });
  // }

  onSubmitNewJobPosting() {
    this.validDates = this.compareTwoDates();
    //this.validExperience = this.checkExperience();

    this.newJobPostingForm.controls["companyName"].markAsTouched();
    this.newJobPostingForm.controls["companyEmail"].markAsTouched();
    this.newJobPostingForm.controls["location"].markAsTouched();
    this.newJobPostingForm.controls["logo"].markAsTouched();
    this.newJobPostingForm.controls["title"].markAsTouched();
    this.newJobPostingForm.controls["jobType"].markAsTouched();
    this.newJobPostingForm.controls["education"].markAsTouched();
    this.newJobPostingForm.controls["experience"].markAsTouched();
    this.newJobPostingForm.controls["durationFrom"].markAsTouched();
    this.newJobPostingForm.controls["durationTo"].markAsTouched();

    if (this.imagePreview === undefined) {
      this.imageValid = false;
    } else {
      if (this.newJobPostingForm.valid && this.validDates) {
        // && this.validExperience
        this.jobPostingService.addJobPosting(
          this.newJobPostingForm.value.companyName,
          this.newJobPostingForm.value.companyEmail,
          this.newJobPostingForm.value.logo,
          null,
          this.newJobPostingForm.value.title,
          this.newJobPostingForm.value.DateFrom,
          this.newJobPostingForm.value.DateTo,
          this.newJobPostingForm.value.location,
          this.newJobPostingForm.value.description,
          this.newJobPostingForm.value.jobType,
          this.newJobPostingForm.value.education,
          "Approved",
          this.newJobPostingForm.value.experience
        );
        this.router.navigate(["/admin-dashboard/job-postings"]);
      }
    }
  }
}
