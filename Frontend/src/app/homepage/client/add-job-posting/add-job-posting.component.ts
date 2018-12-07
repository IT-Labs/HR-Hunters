import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";
import { DateValidator } from "../../../validators/date.validator";

@Component({
  selector: "app-add-job-posting",
  templateUrl: "./add-job-posting.component.html",
  styleUrls: ["./add-job-posting.component.scss"]
})
export class AddJobPostingComponent implements OnInit {
  jobTypes = ["Full-time", "Part-time", "Intership", 'Select job type...'];
  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree",
    'Select education level...'
  ];

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

    this.newJobPostingFormHP.controls.durationFrom.valueChanges.subscribe(x =>
      this.newJobPostingFormHP.controls.durationTo.updateValueAndValidity()
    );
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
    durationTo: ["", Validators.compose([Validators.required, DateValidator])],
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

  onSubmitNewJobPosting() {
    this.newJobPostingFormHP.controls['title'].markAsTouched();
    this.newJobPostingFormHP.controls['durationFrom'].markAsTouched();
    this.newJobPostingFormHP.controls['durationTo'].markAsTouched();
    this.newJobPostingFormHP.controls['location'].markAsTouched();
    this.newJobPostingFormHP.controls['education'].markAsTouched();
    this.newJobPostingFormHP.controls['experience'].markAsTouched();
    this.newJobPostingFormHP.controls['jobType'].markAsTouched();
    console.log(this.newJobPostingFormHP)
    
    if (
      this.newJobPostingFormHP.valid
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
