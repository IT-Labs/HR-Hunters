import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Client } from "src/app/models/client.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { ClientService } from "src/app/services/client.service";
import { Subscription } from "rxjs";
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

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

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  private clientsSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private clientService: ClientService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    const params = this.buildQueryParams()
    this.clientService.getClients(params);
    this.clientsSub = this.clientService
      .getClientsUpdateListener()
      .subscribe(clientsData => {
        this.clients = clientsData.clients;
        this.clients.push({
          companyName: 'Select company...',
          email: ''
        });
      });

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
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
    companyLocation: [
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
    experience: ["", Validators.compose([Validators.required])]
  });

  buildJobPostingDataOnAddJobPosting(
    existingCompany: boolean,
    id: number,
    companyName: string,
    companyEmail: string,
    companyLocation: string,
    jobTitle: string,
    description: string,
    jobType: string,
    education: string,
    experience: number,
    dateFrom: string,
    dateTo: string
  ) {
    const newJobPostingData = {
      existingCompany: existingCompany,
      id: id,
      companyName: companyName,
      companyEmail: companyEmail,
      companyLocation: companyLocation,
      jobTitle: jobTitle,
      description: description,
      jobType: jobType,
      education: education,
      experience: experience,
      dateFrom: dateFrom,
      dateTo: dateTo
    };
    return newJobPostingData;
  }

  buildQueryParams() {
    return `?pageSize=0&currentPage=0`;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  onCompanyRadioBtnClick(comapnyType: string) {
    if (comapnyType === 'existing') {
      this.existingCompany = true;
      this.newJobPostingForm.controls["companyEmail"].disable();
      this.newJobPostingForm.controls["companyLocation"].disable();
    } else if (comapnyType === 'new') {
      this.existingCompany = false;
      this.newJobPostingForm.controls["companyEmail"].enable();
      this.newJobPostingForm.controls["companyLocation"].enable();
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

  populateCompanyInfo(selected: string) {
    this.clients.map(client => {
      if (selected === client.companyName) {
        this.selectedCompany = client;
        this.newJobPostingForm.controls["companyName"].setValue(
          this.selectedCompany.companyName
        );
        this.newJobPostingForm.controls["companyEmail"].setValue(
          this.selectedCompany.email
        );
        this.newJobPostingForm.controls["companyLocation"].setValue(
          this.selectedCompany.location
        );
      }
    });
  }

  onSubmitNewJobPosting() {
    this.newJobPostingForm.controls["companyName"].markAsTouched();
    this.newJobPostingForm.controls["companyEmail"].markAsTouched();
    this.newJobPostingForm.controls["companyLocation"].markAsTouched();
    this.newJobPostingForm.controls["title"].markAsTouched();
    this.newJobPostingForm.controls["jobType"].markAsTouched();
    this.newJobPostingForm.controls["education"].markAsTouched();
    this.newJobPostingForm.controls["experience"].markAsTouched();

    let monthToDate, monthFromDate, dayToDate, dayFromDate, dateFrom, dateTo

    if (this.fromDate && this.toDate) {
      if (this.fromDate.month < 10) {
        monthFromDate = `0${this.fromDate.month}`;
      } else {
        monthFromDate = this.fromDate.month;
      }
      
      if (this.fromDate.day < 10) {
        dayFromDate = `0${this.fromDate.day}`;
      } else {
        dayFromDate = this.fromDate.day;
      }
      
      if (this.toDate.month < 10) {
        monthToDate = `0${this.toDate.month}`;
      } else {
        monthToDate = this.toDate.month;
      }
      
      if (this.fromDate.day < 10) {
        dayToDate = `0${this.toDate.day}`;
      } else {
        dayToDate = this.toDate.day;
      }
  
      dateFrom = `${this.fromDate.year}/${monthFromDate}/${dayFromDate}`
      dateTo = `${this.toDate.year}/${monthToDate}/${dayToDate}`
    }

    let jobPostingData;
    if (this.existingCompany) {
      jobPostingData = this.buildJobPostingDataOnAddJobPosting(
        true,
        this.selectedCompany.id,
        null,
        null,
        null,
        this.newJobPostingForm.value.title,
        this.newJobPostingForm.value.description,
        this.newJobPostingForm.value.jobType,
        this.newJobPostingForm.value.education,
        this.newJobPostingForm.value.experience,
        dateFrom,
        dateTo
      );
    } else if (!this.existingCompany) {
      jobPostingData = this.buildJobPostingDataOnAddJobPosting(
        false,
        0,
        this.newJobPostingForm.value.companyName,
        this.newJobPostingForm.value.companyEmail,
        this.newJobPostingForm.value.companyLocation,
        this.newJobPostingForm.value.title,
        this.newJobPostingForm.value.description,
        this.newJobPostingForm.value.jobType,
        this.newJobPostingForm.value.education,
        this.newJobPostingForm.value.experience,
        dateFrom,
        dateTo
      );
    }

    if (this.newJobPostingForm.valid && this.fromDate && this.toDate) {
      this.jobPostingService.addJobPosting(jobPostingData);
    }

  }
}
