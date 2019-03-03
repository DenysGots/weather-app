import { Component, OnInit } from '@angular/core';

import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-forecast-current-information',
    templateUrl: './forecast-current-information.component.html',
    styleUrls: ['./forecast-current-information.component.scss']
})
export class ForecastCurrentInformationComponent implements OnInit {
    // TODO: get state from cardsDeck
    // TODO: create interface for weatherState
    // @Input() weatherState: any;

    public weatherState: any = {
        location: 'Kyiv, Ukraine',
        timeCurrent: '19:00', // TODO: use Moment for generating this string
        dateCurrent: '5 Mar 2019', // TODO: use Moment for generating this string
        weatherType: 'cloudy', // TODO: create enum for all weather types, use as weather icon type binding
        weatherDefinition: 'Partly cloudy',
        temperatureCurrent: 19, // TODO: create pipe to add + sign in front of temperature
        temperatureFeelsLike: 14,
        temperatureMin: 15,
        temperatureMax: 25,
        humidityCurrent: 5,
        humidityMin: 2.5,
        humidityMax: 7.5,
        windSpeed: 4.5,
        windDirection: '', // TODO: use this string to adjust wind direction icon
        uvIndex: 3,
        airPressure: 745,
    };

    constructor(private mainService: MainService) { }

    ngOnInit() { }
}
