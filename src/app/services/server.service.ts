import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  protocol = 'http://';
  // host = '192.168.0.103';
  // port = ':3000';
  // webSocketsPort = ':3000';
  host = '35.172.100.133';
  port = ':3000';
  webSocketsPort = ':3000';
  sponteURL = 'http://webservices.sponteweb.com.br/WSApiSponteRest/api/';
  headers = {
    "Content-type" : "application/json"
  }
  
  constructor() { }
}
