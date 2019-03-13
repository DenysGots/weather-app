import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

import { Location } from '../interfaces/public-api';

import { WINDOW } from '../services/helpers.service';

@Injectable()
export class HttpService {
    // TODO: implement web socket connection with server here to trigger weather aggregators on interval

    private currentPosition: Location;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };

    constructor(private http: HttpClient,
                @Inject(WINDOW) private window: Window) { }

    public getLocation(handleLocation) {
        // const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        // $.getJSON(getLocationUrl, data => handleLocation(data));

        const serverURL = 'home';
        const routURL = 'location';

        if ('navigator' in this.window) {
            this.window.navigator.geolocation.getCurrentPosition(position => {
                this.currentPosition.longitude = position.coords.longitude;
                this.currentPosition.latitude = position.coords.latitude;
            });
        }

        return this.http.post(`${serverURL}/${routURL}`, this.currentPosition, this.httpOptions);
    }

    public getWeather() {
        const serverURL = 'home';
        const routURL = 'weather';

        console.log('Client: get weather');

        // TODO: change to Post and pass in current location
        return this.http.get(`${serverURL}/${routURL}`, this.httpOptions);
    }
}
