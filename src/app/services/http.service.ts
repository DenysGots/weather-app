import { Observable } from 'rxjs';
// import * as $ from 'jquery';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { Location } from '../interfaces/public-api';
import { Config } from '../app.config';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    // private currentLocation: Location = <Location>{};
    // private serverURL = 'https://app-simple-weather.herokuapp.com';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient,
        private config: Config
    ) {}

    // public getLocation(handleLocation): void {
    //     const getLocationUrl = 'http://ip-api.com/json';
    //
    //     $.getJSON(getLocationUrl, locationData => {
    //         this.currentLocation.city = locationData.timezone.replace(/^\w+\//, '');
    //         this.currentLocation.country = locationData.country;
    //         this.currentLocation.countryCode = locationData.countryCode;
    //         handleLocation(locationData);
    //     });
    // }

    public getWeather(): Observable<any> {
        const getWeatherUrl = 'weather';

        // return this.http.post(`${this.serverURL}/${getWeatherUrl}`, JSON.stringify(this.currentLocation), this.httpOptions);
        return this.http.post(`${this.config.backendUrl}/${getWeatherUrl}`, null, this.httpOptions);
    }

    // public testConnection() {
    //     const routURL = 'test';
    //
    //     this.http.post(`${this.config.backendUrl}/${routURL}`, null,  this.httpOptions)
    //         .subscribe(testData => console.log('testData: ', testData));
    // }
}
