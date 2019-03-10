import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';

@Injectable()
export class HttpService {
    // TODO: implement request to weather aggregators
    // TODO: implement web socket connection with server here

    constructor(private http: HttpClient) {
        this.testServer();
    }

    public getLocation(handleLocation) {
        // TODO: move to server, CORS not allows requests
        // TODO: use latitude/ longitude OR IP address to get location
        // console.log(navigator.geolocation.getCurrentPosition);
        // https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript

        // const httpOptions = {
        //     reportProgress: true,
        //     // responseType: 'text',
        //     headers: new HttpHeaders({
        //         'Content-Type':  'application/json',
        //         'Access-Control-Allow-Origin': '*',
        //     })
        // };
        //
        // return this.http.get(this.getLocationUrl, httpOptions);

        const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        // $.getJSON(getLocationUrl, data => handleLocation(data));
    }

    public testServer() {
        const serverURL = 'home';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };

        console.log('Testing connection Client 1');

        this.http.get(serverURL, httpOptions);
    }
}
