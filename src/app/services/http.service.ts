import * as $ from 'jquery';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private getIpUrl = 'https://api.ipify.org';

  constructor(
    private http: HttpClient,
    private config: Config
  ) {}

  public getWeather(): Observable<any> {
    return this.http.post(`${this.config.backendUrl}/weather`, null, this.httpOptions);
  }

  public getWeatherLocally (clientIp: string): Observable<any> {
    return this.http.post(`${this.config.backendUrl}/local`, { clientIp }, this.httpOptions);
  }

  // Used to get IP with local deployment
  public getIpForLocalDeployment() {
    return $.ajax({
        method: 'GET',
        url: this.getIpUrl,
        dataType: 'text'
      });
  }
}
