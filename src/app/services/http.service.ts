import * as $ from 'jquery';
import { Observable, of } from 'rxjs';

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

  // private serverUrl = 'https://app-simple-weather.herokuapp.com';
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

  public getIpForLocalDeployment() {
    return $.ajax({
        method: 'GET',
        url: this.getIpUrl,
        dataType: 'text'
      });
  }

  // TODO: this works, use IP in case of local start-up
  // public getIp(): any {
  //   $.ajax({
  //     method: 'GET',
  //     url: this.getIpUrl,
  //     dataType: 'text'
  //   }).done((clientIp: any) => console.log('api.ipify.org 2', clientIp));
  // }
}
