import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Client } from "src/app/models/client.model";

@Component({
  selector: "app-ad-new-job-posting",
  templateUrl: "./new-job-posting.component.html",
  styleUrls: ["./new-job-posting.component.scss"]
})
export class ADNewJobPostingComponent implements OnInit {

  jobTypes = ["Full-time", "Part-time", "Intership"];
  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree"
  ];

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
    "20+"
  ];

  filteredExperience = [];

  companies: Client[] = [
    {
      id: "1",
      companyName: "AMC",
      email: "amc@email.com",
      jobs: "1",
      logo: "img",
      status: "active",
      location: "Skopje"
    },
    {
      id: "1",
      companyName: "IVO",
      email: "IVO",
      jobs: "1",
      logo: "img",
      status: "active",
      location: "IVO"
    },
    {
      id: "1",
      companyName: "Anhoch",
      email: "amc@email.com",
      jobs: "1",
      logo: "img",
      status: "active",
      location: "Skopje"
    },
    {
      id: "1",
      companyName: "Neptun",
      email: "amc@email.com",
      jobs: "1",
      logo: "img",
      status: "active",
      location: "Prilep"
    }
  ];

  selectedCompany: Client = {
    id: null,
    companyName: null,
    email: null,
    jobs: null,
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

  constructor(private fb: FormBuilder) {}

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
    logo: [""],
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
    experience: [
      "",
      Validators.compose([Validators.required, Validators.maxLength(3)])
    ],
    durationFrom: ["", Validators.compose([Validators.required])],
    durationTo: ["", Validators.compose([Validators.required])]
  });

  compareTwoDates() {
    if (
      new Date(this.newJobPostingForm.controls["durationFrom"].value) >=
      new Date(this.newJobPostingForm.controls["durationTo"].value)
    ) {
      return false;
    }
    return true;
  }

  checkExperience() {
    this.experience.map(x => {
      if (x === this.newJobPostingForm.controls["experience"].value) {
        return true;
      }
    });
    return false;
  }

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
  populateExperience(event: any) {
    this.onFocus("none");
    const experience = event.target.innerText;
    this.experience.map(num => {
      if (num === experience) {
        this.newJobPostingForm.controls["experience"].setValue(experience);
      }
    });
  }

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

  populateExperienceSuggestions(event: any) {
    this.filteredExperience = [];
    this.experience.map(num => {
      if (num.includes(event.target.value)) {
        this.filteredExperience.push(num);
      }
    });
  }

  onSubmitNewJobPosting() {
    const validDates = this.compareTwoDates();
    const validExperience = this.checkExperience();
    if (this.newJobPostingForm.valid && validDates && validExperience) {
      console.log(this.newJobPostingForm.value);
    }
  }
}
