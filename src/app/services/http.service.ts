import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

import { Location } from '../interfaces/public-api';

import { WINDOW } from '../services/helpers.service';

@Injectable()
export class HttpService {
    // TODO: implement web socket connection with server here to trigger weather aggregators on interval

    private currentPosition: Location = <Location>{};
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

        const serverURL = 'http://localhost:5400';
        const routURL = 'location';

        // console.log(this.window);
        // console.log(this.window.navigator);
        // console.log(this.window.navigator.geolocation);
        console.log(window.navigator);

        // if ('navigator' in this.window) {
            window.navigator.geolocation.getCurrentPosition(position => {
                this.currentPosition.longitude = position.coords.longitude;
                this.currentPosition.latitude = position.coords.latitude;
            });
        // }

        console.log('Client: get location', JSON.stringify(this.currentPosition));

        return this.http.post(`${serverURL}/${routURL}`, JSON.stringify(this.currentPosition), this.httpOptions);
        // return this.http.post(`${routURL}`, this.currentPosition, this.httpOptions);
    }

    public getWeather() {
        const serverURL = 'http://localhost:5400';
        const routURL = 'weather';

        console.log('Client: get weather');

        // TODO: change to Post and pass in current location
        return this.http.post(`${serverURL}/${routURL}`, JSON.stringify({}), this.httpOptions);
    }
}
