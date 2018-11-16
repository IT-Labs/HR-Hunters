import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./authentication/admin/admin.component";
import { ClientLoginComponent } from "./authentication/clients/login/login.component";
import { ClientRegisterComponent } from "./authentication/clients/register/register.component";
import { ApplicantLoginComponent } from "./authentication/applicants/login/login.component";
import { ApplicantRegisterComponent } from "./authentication/applicants/register/register.component";
import { AddJobPostingComponent } from "./homepage/client/add-job-posting/add-job-posting.component";
import { ApplicationsComponent } from "./admin-dashboard/applications/applications.component";
import { ClientsComponent } from "./authentication/clients/clients.component";
import { ApplicantsComponent } from "./authentication/applicants/applicants.component";
import { ClientComponent } from "./homepage/client/client.component";
import { ClientJobPostingsComponent } from "./homepage/client/client-job-postings/client-job-postings.component";
import { JobPostingDetailsComponent } from "./homepage/applicant/job-posting-details/job-posting-details.component";
import { NewJobPostingComponent } from "./admin-dashboard/job-postings/new-job-posting/new-job-posting.component";
import { ApplicantApplicationsComponent } from "./homepage/applicant/applicant-applications/applicant-applications.component";
import { ErrorComponent } from "./error/error.component";
import { AppicantJobPostingsComponent } from "./homepage/applicant/applicant-job-postings/applicant-job-postings.component";
import { JobPostingsComponent } from "./admin-dashboard/job-postings/job-postings.component";
import { ClientProfileComponent } from "./homepage/client/client-profile/client-profile.component";
import { ApplicantProfileComponent } from "./homepage/applicant/applicant-profile/applicant-profile.component";
import { WelcomeComponent } from "./authentication/welcome.component";

const routes: Routes = [
  { path: "hr-admin", component: AdminComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "client-login", component: ClientLoginComponent },
  { path: "client-register", component: ClientRegisterComponent },
  { path: "applicant-login", component: ApplicantLoginComponent },
  { path: "applicant-register", component: ApplicantRegisterComponent },
  {
    path: "admin-dashboard",
    component: AdminComponent,
    children: [
      {
        path: "job-postings",
        component: JobPostingsComponent,
        children: [{ path: "new", component: NewJobPostingComponent }]
      },
      { path: "applications", component: ApplicationsComponent },
      { path: "clients", component: ClientsComponent },
      { path: "applicants", component: ApplicantsComponent }
    ]
  },
  {
    path: "client",
    component: ClientComponent,
    children: [
      { path: "profile", component: ClientProfileComponent },
      { path: "job-postings/:id", component: ClientJobPostingsComponent },
      { path: "job-posting/:id", component: JobPostingDetailsComponent },
      { path: "add-job-posting", component: AddJobPostingComponent }
    ]
  },
  {
    path: "applicant",
    component: ApplicantsComponent,
    children: [
      { path: "profile", component: ApplicantProfileComponent },
      { path: "job-postings", component: AppicantJobPostingsComponent },
      { path: "job-posting/:id", component: JobPostingDetailsComponent },
      { path: "applications/:id", component: ApplicantApplicationsComponent }
    ]
  },
  { path: "**", component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
