import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import * as io from 'socket.io-client';

import { Location, Position } from '../interfaces/public-api';

import { WINDOW } from '../services/helpers.service';

@Injectable({
    providedIn: 'root',
})
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
        const getLocationUrl3 = 'http://ip-api.com/json';
        $.getJSON(getLocationUrl3, locationData => {
            console.log('ip-api', locationData);

            this.currentLocation.city = locationData.timezone.replace(/^\w+\//, '');
            this.currentLocation.country = locationData.country;
            this.currentLocation.countryCode = locationData.countryCode;
            handleLocation(locationData);
        });

        // const getLocationUrl6 = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        // $.getJSON(getLocationUrl6, locationData => {
        //     console.log('geobytes', locationData);
        //     this.currentLocation.city = locationData.geobytescapital;
        //     this.currentLocation.country = locationData.geobytescountry;
        //     this.currentLocation.countryCode = locationData.geobytesinternet;
        //     handleLocation(locationData);
        // });
        //
        // // TODO: test
        // const getLocationUrl5 = 'https://api.ipdata.co/?api-key=1527fc57d30cbf794212bf60045df51c0c29f624cd427073b0b2b6dc';
        // $.getJSON(getLocationUrl5, locationData => {
        //     console.log('ipdata', locationData);
        //     this.currentLocation.city = locationData.time_zone.name.replace(/^\w+\//, '');
        //     this.currentLocation.country = locationData.country_name;
        //     // this.currentLocation.countryCode = locationData.geobytesinternet;
        //     handleLocation(locationData);
        // });
        //
        // const getLocationUrl1 = 'http://ipinfo.io/?callback=callback';
        // $.getJSON(getLocationUrl1, locationData => {
        //     console.log('ipinfo callback', locationData);
        //     this.currentLocation.city = locationData.geobytescapital;
        //     this.currentLocation.country = locationData.geobytescountry;
        //     this.currentLocation.countryCode = locationData.geobytesinternet;
        //     handleLocation(locationData);
        // });
        //
        // const getLocationUrl4 = 'https://ipinfo.io';
        // $.getJSON(getLocationUrl4, locationData => {
        //     console.log('ipinfo', locationData);
        //     this.currentLocation.city = locationData.city;
        //     this.currentLocation.country = locationData.region;
        //     // this.currentLocation.countryCode = locationData.geobytesinternet;
        //     handleLocation(locationData);
        // });

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
