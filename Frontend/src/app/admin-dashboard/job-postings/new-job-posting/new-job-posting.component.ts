import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-ad-new-job-posting",
  templateUrl: "./new-job-posting.component.html",
  styleUrls: ["./new-job-posting.component.scss"]
})
export class ADNewJobPostingComponent {
  selectedTab = {
    new: true,
    existing: false
  };

  jobTypes = ['Full-time', 'Part-time', 'Intership']
  education = ['High School degree', 'Bachelor degree', 'Masters degree', 'Doctoral degree']

  constructor(private fb: FormBuilder) {}

  newJobPostingForm = this.fb.group({
    companyName: [
      "",
      // Validators.compose([
      //   Validators.required,
      //   Validators.minLength(1),
      //   Validators.maxLength(50)
      // ])
    ],
    companyEmail: [
      "",
      // Validators.compose([
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(30),
      //   Validators.email
      // ])
    ],
    location: [
      "",
      // Validators.compose([
      //   Validators.required,
      //   Validators.minLength(1),
      //   Validators.maxLength(30),
      //   Validators.email
      // ])
    ],
    logo: ["", 
    // Validators.compose([])
  ],
    title: [
      "",
      // Validators.compose([
      //   Validators.required,
      //   Validators.minLength(1),
      //   Validators.maxLength(50)
      // ])
    ],
    description: [
      "",
      // Validators.compose([
      //   Validators.maxLength(300)
      // ])
    ],
    jobType: [
      "",
      // Validators.compose([
      //   Validators.required
      // ])
    ],
    education: [
      "",
      // Validators.compose([
      //   Validators.required
      // ])
    ],
    experience: [
      "",
      // Validators.compose([
      //   Validators.required
      // ])
    ],
    durationFrom: [
      "",
      // Validators.compose([
      //   Validators.required
      // ])
    ],
    durationTo: [
      "",
      // Validators.compose([
      //   Validators.required
      // ])
    ],
  });

  onChangeTab(event: string) {
    if (event === "new") {
      this.selectedTab.new = true;
      this.selectedTab.existing = false;
    } else if (event === "existing") {
      this.selectedTab.new = false;
      this.selectedTab.existing = true;
    }
  }

  onSubmitNewJobPosting() {
    console.log(this.newJobPostingForm.value);

    if (this.newJobPostingForm.valid) {
      this.newJobPostingForm.reset();
    }
  }
}
