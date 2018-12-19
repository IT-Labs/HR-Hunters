import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientRegisterComponent } from "./authentication/clients/register/register.component";
import { ApplicantRegisterComponent } from "./authentication/applicants/register/register.component";
import { AddJobPostingComponent } from "./homepage/client/add-job-posting/add-job-posting.component";
import { ClientComponent } from "./homepage/client/client.component";
import { ClientJobPostingsComponent } from "./homepage/client/client-job-postings/client-job-postings.component";
import { JobPostingDetailsComponent } from "./homepage/job-posting-details/job-posting-details.component";
import { ApplicantApplicationsComponent } from "./homepage/applicant/applicant-applications/applicant-applications.component";
import { ErrorComponent } from "./error/error.component";
import { JobPostingsListComponent } from "./homepage/applicant/job-postings-list/job-postings-list.component";
import { ClientProfileComponent } from "./homepage/client/client-profile/client-profile.component";
import { ApplicantProfileComponent } from "./homepage/applicant/applicant-profile/applicant-profile.component";
import { WelcomeComponent } from "./authentication/welcome.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { LoginComponent } from "./authentication/login/login.component";
import { ADApplicantsComponent } from "./admin-dashboard/applicants/applicants.component";
import { ADApplicationsComponent } from "./admin-dashboard/applications/applications.component";
import { ADClientsComponent } from "./admin-dashboard/clients/clients.component";
import { ADJobPostingsComponent } from "./admin-dashboard/job-postings/job-postings.component";
import { ADNewJobPostingComponent } from "./admin-dashboard/job-postings/new-job-posting/new-job-posting.component";

import { ApplicantComponent } from "./homepage/applicant/applicant.component";
import { NewClientComponent } from "./admin-dashboard/clients/new-client/new-client.component";
import { AuthAdminGuard } from "./auth-guards/auth-admin.guard";
import { AuthClientGuard } from "./auth-guards/auth-client.guard";
import { AuthApplicantGuard } from "./auth-guards/auth-applicant.guard";
import { AddCSVComponent } from "./admin-dashboard/job-postings/add-csv/add-csv.component";
import { ApplicationDetailsComponent } from "./homepage/application-details/application-details.component";

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "welcome", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: "client-register", component: ClientRegisterComponent },
  { path: "applicant-register", component: ApplicantRegisterComponent },
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    canActivate: [AuthAdminGuard],
    children: [
      { path: "applicants", component: ADApplicantsComponent },
      { path: "applications", component: ADApplicationsComponent },
      { path: "clients", component: ADClientsComponent },
      { path: "new-client", component: NewClientComponent },
      { path: "job-postings", component: ADJobPostingsComponent },
      { path: "new-job-posting", component: ADNewJobPostingComponent },
      { path: "new-job-posting/:id", component: ADNewJobPostingComponent },
      { path: "new-csv", component: AddCSVComponent },
    ]
  },
  {
    path: "client",
    component: ClientComponent,
    canActivate: [AuthClientGuard],
    children: [
      { path: "profile", component: ClientProfileComponent },
      { path: "job-postings", component: ClientJobPostingsComponent },
      { path: "job-postings/:id", component: JobPostingDetailsComponent },
      { path: "add-job-posting", component: AddJobPostingComponent }
    ]
  },
  {
    path: "applicant",
    component: ApplicantComponent,
    canActivate: [AuthApplicantGuard],
    children: [
      { path: "profile", component: ApplicantProfileComponent },
      { path: "job-postings", component: JobPostingsListComponent },
      { path: "job-postings/:id", component: JobPostingDetailsComponent },
      { path: "my-applications", component: ApplicantApplicationsComponent },
      { path: "my-applications/:id", component: ApplicationDetailsComponent }
    ]
  },
  { path: "**", component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthAdminGuard, AuthApplicantGuard, AuthClientGuard]
})
export class AppRoutingModule {}
