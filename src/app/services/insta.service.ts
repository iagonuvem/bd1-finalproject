import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstaService {

  public baseAPI: string = "https://graph.instagram.com/me";
  public ApiKey: string = "IGQVJYYUxRVG85Q2pxRHZAaSHo0d3R2c0tKd25ueTUta3JfTTk1VUQ5STllMk1QbEdqSkJ6U2FJX09ObXN2WmFkR0c2MnFRX3A5VEJyZA2lhTXNrNXUtMVBVdVBMcXhMNWxaQnFmWmdmaVJuNFFYV282agZDZD";

  constructor(public http: HttpClient) {
    // console.log('Hello InstaService');
  }

  getInstaContent() {
    return this.http.get(`${this.baseAPI}/media?fields=media_type,thumbnail_url,username,media_url&access_token=${this.ApiKey}`)
  }

  public setApiKey(api_key){
    this.ApiKey = api_key;
  }

}
