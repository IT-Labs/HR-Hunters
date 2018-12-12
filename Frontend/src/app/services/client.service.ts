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
      }>(this.baseUrl + "/Clients" + queryParams)
      .subscribe(clientsData => {
        this.clientsUpdated.next({
          clients: clientsData.clients,
          clientsCount: clientsData.maxClients,
          active: clientsData.active,
          inactive: clientsData.inactive
        });
      });
  }

  updateClient(clientData) {
    this.http
      .put(this.baseUrl + "/Clients" + clientData.id, clientData)
      .subscribe(response => {});
  }
}
