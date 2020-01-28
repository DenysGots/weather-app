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
    console.log('environment: ', (window as any).environment);
    console.log('config: ', this.config);

    const getWeatherLocally = (clientIp: string) =>
      this.http.post(`${this.config.backendUrl}/weather-locally`, { clientIp }, this.httpOptions);

    return ['dev', 'local'].includes((window as any).environment.config)
      ? of(this.getIpForLocalDeployment().done((clientIp: string) => getWeatherLocally(clientIp)))
      : this.http.post(`${this.config.backendUrl}/weather`, null, this.httpOptions);

    // return this.http.post(`${this.config.backendUrl}/weather`, null, this.httpOptions);
  }

  private getIpForLocalDeployment() {
    return $.ajax({
        method: 'GET',
        url: this.getIpUrl,
        dataType: 'text'
      });
  }

  // TODO: this works, use IP in case of local start-up
  // TODO: delete
  public getIp(): any {
    $.ajax({
      method: 'GET',
      url: this.getIpUrl,
      dataType: 'text'
    }).done((clientIp: any) => console.log('api.ipify.org 2', clientIp));
  }
}
