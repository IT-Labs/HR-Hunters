import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";
import { mimeType } from "src/app/validators/mime-type.validator";

@Component({
  selector: "app-add-job-posting",
  templateUrl: "./add-job-posting.component.html",
  styleUrls: ["./add-job-posting.component.scss"]
})
export class AddJobPostingComponent implements OnInit {
  jobTypes = ["Full-time", "Part-time", "Intership"];
  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree"
  ];

  validDates: boolean;
  validExperience: boolean;

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
    this.filteredExperience = this.experience.slice();
  }

  newJobPostingFormHP = this.fb.group({
    title: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])
    ],
    durationFrom: ["", Validators.compose([Validators.required])],
    durationTo: ["", Validators.compose([Validators.required])],
    location: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])
    ],
    education: ["", Validators.compose([Validators.required])],
    experience: [
      "",
      Validators.compose([Validators.required, Validators.maxLength(3)])
    ],
    jobType: ["", Validators.compose([Validators.required])],
    description: ["", Validators.compose([Validators.maxLength(300)])]
  });

  compareTwoDates() {
    if (
      new Date(this.newJobPostingFormHP.controls["durationFrom"].value) >=
      new Date(this.newJobPostingFormHP.controls["durationTo"].value)
    ) {
      return false;
    }
    return true;
  }

  checkExperience() {
    for (let i = 0; i < this.experience.length; i++) {
      if (
        this.experience[i] ==
        this.newJobPostingFormHP.controls["experience"].value
      ) {
        return true;
      }
    }
    return false;
  }

  onFocus(event: any) {
    this.formFocus = {
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

  populateExperience(event: any) {
    this.onFocus("none");
    const experience = event.target.innerText;
    this.experience.map(num => {
      if (num === experience) {
        this.newJobPostingFormHP.controls["experience"].setValue(experience);
      }
    });
  }

  populateExperienceSuggestions(event: any) {
    this.filteredExperience = [];
    this.experience.map(num => {
      if (num.includes(event.target.value)) {
        this.filteredExperience.push(num);
      }
    });
  }

  onSubmitNewJobPosting() {
    this.validDates = this.compareTwoDates();
    this.validExperience = this.checkExperience();
    this.newJobPostingFormHP.controls['title'].markAsTouched();
    this.newJobPostingFormHP.controls['durationFrom'].markAsTouched();
    this.newJobPostingFormHP.controls['durationTo'].markAsTouched();
    this.newJobPostingFormHP.controls['location'].markAsTouched();
    this.newJobPostingFormHP.controls['education'].markAsTouched();
    this.newJobPostingFormHP.controls['experience'].markAsTouched();
    this.newJobPostingFormHP.controls['jobType'].markAsTouched();
    console.log(this.newJobPostingFormHP)
    
    if (
      this.newJobPostingFormHP.valid &&
      this.validDates &&
      this.validExperience
      ) {
      this.jobPostingService.addJobPosting(
        'company name',
        'company mail',
        'company logo',
        1,
        this.newJobPostingFormHP.value.title,
        this.newJobPostingFormHP.value.DateFrom,
        this.newJobPostingFormHP.value.DateTo,
        this.newJobPostingFormHP.value.location,
        this.newJobPostingFormHP.value.description,
        this.newJobPostingFormHP.value.jobType,
        this.newJobPostingFormHP.value.education,
        "Approved",
        this.newJobPostingFormHP.value.experience
      );
      this.router.navigate(["/client"]);
    }
  }
}
