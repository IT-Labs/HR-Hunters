import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Client } from "../models/client.model";
import { environment } from "../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class ClientService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getClients(queryParams) {
    return this.http.get<{
      clients: Client[];
      maxClients: number;
      active: number;
      inactive: number;
    }>(this.baseUrl + "/Clients" + queryParams);
  }

  getClient(clientId) {
    return this.http.get<Client>(this.baseUrl + "/Clients/" + clientId);
  }

  addClient(clientData) {
    return this.http.post(this.baseUrl + "/Clients", clientData);
  }

  updateClientStatus(clientData, clientId) {
    return this.http.put(this.baseUrl + "/Clients/" + clientId + '/status', clientData);
  }

  updateClientProfile(clientData, clientId) {
    return this.http.put(this.baseUrl + "/Clients/" + clientId, clientData);
  }

  uploadCLientLogo(clientId, logo) {
    return this.http.put(this.baseUrl + "/Clients/image/" + clientId, logo);
  }
}
