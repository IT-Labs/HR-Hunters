import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";
import { environment } from "../../environments/environment.prod";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class ClientService {
  baseUrl = environment.baseUrl;

  // Observable watching when clients get updated
  private clientsUpdated = new Subject<{
    clients: Client[];
    clientsCount: number;
    active: number;
    inactive: number;
  }>();

  private clientProfile = new Subject<{
    client: Client;
  }>();

  private clientErrorListener = new Subject<{
    error: string;
  }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  // This method should be called within onInit within a component clients postings
  getClientsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  getClientProfileListener() {
    return this.clientProfile.asObservable();
  }

  getClientErrorListener() {
    return this.clientErrorListener.asObservable();
  }

  // Get all applications
  getClients(queryParams) {
    this.http
      .get<{
        clients: Client[];
        maxClients: number;
        active: number;
        inactive: number;
      }>(this.baseUrl + "/Clients" + queryParams)
      .subscribe(
        clientsData => {
          this.clientsUpdated.next({
            clients: clientsData.clients,
            clientsCount: clientsData.maxClients,
            active: clientsData.active,
            inactive: clientsData.inactive
          });
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  getClient(clientId) {
    this.http
      .get<{
        id: number;
        companyName: string;
        logo: string;
        email: string;
        location: string;
        activeJobs: number;
        allJobs: number;
        status: string;
      }>(this.baseUrl + "/Clients/" + clientId)
      .subscribe(
        clientsData => {
          this.clientProfile.next({
            client: clientsData
          });
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  // addClient(clientData) {
  //   return this.http.post(this.baseUrl + "/Clients", clientData);
  // }

  addClient(clientData) {
    this.http
      .post<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Clients", clientData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/clients"]);
            this.toastrService.success("", "Client added successfully!");
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
          }
          if (!!error.error.errors) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  updateClientStatus(clientData) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Clients", clientData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/clients"]);
            this.toastrService.success(
              "",
              "Client status updated successfully!"
            );
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  updateClientProfile(clientData, clientId) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Clients/" + clientId, clientData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["/admin-dashboard/clients"]);
            this.toastrService.success("", "Profile updated successfully!");
          } else if (!response.succeeded) {
            this.clientErrorListener.next({
              error: response.errors.Error[0]
            });
          }
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            return;
          }
          if (error.error) {
            this.toastrService.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
          }
        }
      );
  }

  uploadCLientLogo(clientId, logo) {
    this.http
      .put<{
        succeeded: boolean;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Uploads/Image/" + clientId, logo)
      .subscribe(response => {
        if (response.succeeded) {
          this.toastrService.success("", "Image updloaded successfully!");
        }
      }, error => {
        if (error.status == 401) {
          this.authService.logout();
          return;
        }
        if (error.error) {
          this.toastrService.error(
            // error.error.errors.Error[0],
            // "Error occured!"
          );
        }
      });
  }
}
