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
  imagePreview: string | ArrayBuffer;
  imageValid = true;
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
    description: ["", Validators.compose([Validators.maxLength(300)])],
    logo: [
      "",
      {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
    ]
  });
}
