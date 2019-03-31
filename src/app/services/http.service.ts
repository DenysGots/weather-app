import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import * as io from 'socket.io-client';

import { Location, Position } from '../interfaces/public-api';

import { WINDOW } from '../services/helpers.service';

@Injectable()
export class HttpService {
    // TODO: implement web socket connection with server here to trigger weather aggregators on interval

    private currentPosition: Position = <Position>{};
    private currentLocation: Location = <Location>{};
    private serverURL = 'http://localhost:5400';

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };

    constructor(private http: HttpClient,
                @Inject(WINDOW) private window: Window) { }

    public getLocation(handleLocation) {
        const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        $.getJSON(getLocationUrl, locationData => {
            this.currentLocation.city = locationData.geobytescapital;
            this.currentLocation.country = locationData.geobytescountry;
            this.currentLocation.countryCode = locationData.geobytesinternet;
            handleLocation(locationData);
        });

        // TODO: window object is undefined with AOT, needs to be fixed
        // const serverURL = 'http://localhost:5400';
        // const routURL = 'location';
        // window.navigator.geolocation.getCurrentPosition(position => {
        //     this.currentPosition.longitude = position.coords.longitude;
        //     this.currentPosition.latitude = position.coords.latitude;
        // });
        // console.log('Client: get location', JSON.stringify(this.currentPosition));
        // return this.http.post(`${serverURL}/${routURL}`, JSON.stringify(this.currentPosition), this.httpOptions);
    }

    public getWeather() {
        const routURL = 'weather';
        return this.http.post(`${this.serverURL}/${routURL}`, JSON.stringify(this.currentLocation), this.httpOptions);
    }
}
