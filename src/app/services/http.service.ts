import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

import { Location } from '../interfaces/public-api';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private currentLocation: Location = <Location>{};
    private serverURL = 'https://app-simple-weather.herokuapp.com';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    public getLocation(handleLocation) {
        const getLocationUrl = 'http://ip-api.com/json';

        $.getJSON(getLocationUrl, locationData => {
            this.currentLocation.city = locationData.timezone.replace(/^\w+\//, '');
            this.currentLocation.country = locationData.country;
            this.currentLocation.countryCode = locationData.countryCode;
            handleLocation(locationData);
        });
    }

    public getWeather() {
        const routURL = 'weather';
        return this.http.post(`${this.serverURL}/${routURL}`, JSON.stringify(this.currentLocation), this.httpOptions);
    }
}
