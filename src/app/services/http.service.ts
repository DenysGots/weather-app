import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';

@Injectable()
export class HttpService {
    // TODO: implement web socket connection with server here to trigger weather aggregators on interval

    constructor(private http: HttpClient) { }

    public getLocation(handleLocation) {
        const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        $.getJSON(getLocationUrl, data => handleLocation(data));
    }

    public getWeather() {
        const serverURL = 'home';
        const routURL = 'weather';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };

        console.log('Client: get weather');

        // TODO: change to Post and pass in current location
        return this.http.get(`${serverURL}/${routURL}`, httpOptions);
    }
}
