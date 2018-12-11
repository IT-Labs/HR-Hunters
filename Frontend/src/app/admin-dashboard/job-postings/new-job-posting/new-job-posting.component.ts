import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Client } from "src/app/models/client.model";
import { DateValidator } from "../../../validators/date.validator";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";
import { ClientService } from "src/app/services/client.service";
import { Subscription } from "rxjs";

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
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  existingCompany = false;
  filteredClients = [];
  clients: Client[] = [];
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
  selectedCompany: Client = {
    id: null,
    email: null,
    companyName: null,
    activeJobs: null,
    allJobs: null,
    status: null,
    location: null
  };
  formFocus = {
    companyName: false,
    companyEmail: false,
    title: false,
    description: false,
    jobType: false,
    education: false,
    experience: false,
    dateFrom: false,
    dateTo: false
  };
  private clientsSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientService.getAllClients();
    this.clientsSub = this.clientService
      .getClientsUpdateListener()
      .subscribe(clientsData => {
        this.clients = clientsData.clients;
      });
    this.newJobPostingForm.controls.dateFrom.valueChanges.subscribe(x =>
      this.newJobPostingForm.controls.dateTo.updateValueAndValidity()
    );
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
        Validators.pattern(this.validEmail)
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
    dateFrom: ["", Validators.compose([Validators.required])],
    dateTo: ["", Validators.compose([Validators.required, DateValidator])]
  });

  buildJobPostingDataOnAddJobPosting(
    companyId: number,
    companyName: string,
    companyEmail: string,
    companyLocation: string,
    jobTitle: string,
    dateFrom: string,
    dateTo: string,
    description: string,
    jobType: string,
    education: string,
    experience: number
  ) {
    const clientData = {
      companyId: companyId,
      companyName: companyName,
      companyEmail: companyEmail,
      companyLocation: companyLocation
    };
    const jobPostingData = {
      jobTitle: jobTitle,
      dateFrom: dateFrom,
      dateTo: dateTo,
      companyLocation: companyLocation,
      description: description,
      jobType: jobType,
      education: education,
      experience: experience
    };
    const jpAndClientData = {
      client: clientData,
      jobPosing: jobPostingData
    };
    return jpAndClientData;
  }

  onCompanyRadioBtnClick() {
    if (this.existingCompany) {
      this.newJobPostingForm.controls["companyEmail"].disable();
      this.newJobPostingForm.controls["location"].disable();
    } else if (!this.existingCompany) {
      this.newJobPostingForm.controls["companyEmail"].enable();
      this.newJobPostingForm.controls["location"].enable();
    }
  }

  onFocus(event: any) {
    this.formFocus = {
      companyName: false,
      companyEmail: false,
      title: false,
      description: false,
      jobType: false,
      education: false,
      experience: false,
      dateFrom: false,
      dateTo: false
    };
    this.formFocus[event] = true;
  }

  populateCompanyInfo(event: any, id: number) {
    this.onFocus("none");
    this.selectedCompany.id = id;
    const companyName = event.target.innerText;
    this.clients.map(client => {
      if (client.companyName === companyName) {
        this.selectedCompany = client;
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

  populateCompanySuggestions(event: any) {
    this.filteredClients = [];
    this.clients.filter(client => {
      if (
        client.companyName
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.filteredClients.push(client);
      }
    });
  }

  onSubmitNewJobPosting() {
    this.newJobPostingForm.controls["companyName"].markAsTouched();
    this.newJobPostingForm.controls["companyEmail"].markAsTouched();
    this.newJobPostingForm.controls["location"].markAsTouched();
    this.newJobPostingForm.controls["title"].markAsTouched();
    this.newJobPostingForm.controls["jobType"].markAsTouched();
    this.newJobPostingForm.controls["education"].markAsTouched();
    this.newJobPostingForm.controls["experience"].markAsTouched();
    this.newJobPostingForm.controls["dateFrom"].markAsTouched();
    this.newJobPostingForm.controls["dateTo"].markAsTouched();

    let jobPostingData;

    if (this.existingCompany) {
      jobPostingData = this.buildJobPostingDataOnAddJobPosting(
        this.selectedCompany.id,
        null,
        null,
        null,
        this.newJobPostingForm.value.title,
        this.newJobPostingForm.value.DateFrom,
        this.newJobPostingForm.value.DateTo,
        this.newJobPostingForm.value.description,
        this.newJobPostingForm.value.jobType,
        this.newJobPostingForm.value.education,
        this.newJobPostingForm.value.experience
      );
    } else if (!this.existingCompany) {
      jobPostingData = this.buildJobPostingDataOnAddJobPosting(
        null,
        this.newJobPostingForm.value.companyName,
        this.newJobPostingForm.value.companyEmail,
        this.newJobPostingForm.value.companyLocation,
        this.newJobPostingForm.value.title,
        this.newJobPostingForm.value.DateFrom,
        this.newJobPostingForm.value.DateTo,
        this.newJobPostingForm.value.description,
        this.newJobPostingForm.value.jobType,
        this.newJobPostingForm.value.education,
        this.newJobPostingForm.value.experience
      );
    }

    if (this.newJobPostingForm.valid) {
      this.jobPostingService.addJobPosting(jobPostingData);
      this.router.navigate(["/admin-dashboard/job-postings"]);
    }
  }
}
