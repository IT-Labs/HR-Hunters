import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";

@Injectable({ providedIn: "root" })
export class ClientService {
  // Local list of clients
  private clients: Client[] = [];

  // Observable watching when clients get updated
  private clientsUpdated = new Subject<{
    clients: Client[];
    clientsCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // This method should be called within onInit within a component clients postings
  getClientsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  // Get all applications
  getClients(
    clientsPerPage: number,
    currentPage: number,
    sortedBy: string,
    sortDirection: number,
    filterBy: string
  ) {
    const queryParams = `?pagesize=${clientsPerPage}&page=${currentPage}&sort=${sortedBy}&sortDir=${sortDirection}&filter=${filterBy}`;
    this.http
      .get<{ clients: Client[]; maxClients: number }>(
        "http://localhost:3000/dataClients"
      )
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
            maxClients: clientsData.maxClients
          };
        })
      )
      .subscribe(transformedClientsData => {
        this.clients = transformedClientsData.clients;
        this.clientsUpdated.next({
          clients: this.clients,
          clientsCount: transformedClientsData.maxClients
        });
      });
  }
}
