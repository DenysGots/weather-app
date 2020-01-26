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

  private serverUrl = 'https://app-simple-weather.herokuapp.com';

  constructor(
    private http: HttpClient,
    private config: Config
  ) {}

  public getWeather(): Observable<any> {
    const getWeatherUrl = 'weather';
    // return this.http.post(`${this.config.backendUrl}/${getWeatherUrl}`, null, this.httpOptions);
    return this.http.post(`${this.serverUrl}/${getWeatherUrl}`, null, this.httpOptions);
  }
}
