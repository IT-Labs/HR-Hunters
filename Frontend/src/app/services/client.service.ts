import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ClientService {
  baseUrl = environment.baseUrl;
  // Local list of clients
  private clients: Client[] = [];

  // Observable watching when clients get updated
  private clientsUpdated = new Subject<{
    clients: Client[];
    clientsCount: number;
    active: number;
    inactive: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // This method should be called within onInit within a component clients postings
  getClientsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  // Get all applications
  getClients(queryParams) {
    this.http
      .get<{
        clients: Client[];
        maxClients: number;
        active: number;
        inactive: number;
      }>(this.baseUrl + '/Admin/clients' + queryParams)
      .pipe(
        map(clientsData => {
          return {
            clients: clientsData.clients.map(client => {
              return {
                id: client.id,
                email: client.email,
                companyName: client.companyName,
                logo: client.logo,
                activeJobs: client.activeJobs,
                allJobs: client.allJobs,
                status: client.status,
                location: client.location
              };
            }),
            maxClients: clientsData.maxClients,
            active: clientsData.active,
            inactive: clientsData.inactive
          };
        })
      )
      .subscribe(transformedClientsData => {
        this.clients = transformedClientsData.clients;
        this.clientsUpdated.next({
          clients: this.clients,
          clientsCount: transformedClientsData.maxClients,
          active: transformedClientsData.active,
          inactive: transformedClientsData.inactive
        });
      });
  }

  updateClient(
    id: number,
    email: string,
    companyName: string,
    logo: File | string,
    activeJobs: number,
    allJobs: number,
    status: string,
    location: string
  ) {
    let clientData: Client | FormData;
    if (typeof logo === "object") {
      clientData = new FormData();
      clientData.append("id", id.toString());
      clientData.append("email", email);
      clientData.append("companyName", companyName);
      clientData.append("logo", logo, companyName);
      clientData.append("activeJobs", activeJobs.toString());
      clientData.append("allJobs", allJobs.toString());
      clientData.append("status", status);
      clientData.append("location", location);
    } else {
      clientData = {
        id: id,
        email: email,
        companyName: companyName,
        logo: logo,
        activeJobs: activeJobs,
        allJobs: allJobs,
        status: status,
        location: location
      };
    }
    this.http
      .put("http://localhost:3000/dataJPupdate" + id, clientData)
      .subscribe(response => {});
  }
}
