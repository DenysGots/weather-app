import { Injectable } from '@angular/core';

import {
    MoonPhases,
    Overcast,
    State,
    WeatherDefinitions,
    WeatherState,
    WeatherTypes,
    WindDirections,
} from '../interfaces/public-api';

@Injectable()
export class StateService {
    public currentState: State = {
        overcast: Overcast.light,
        dayLength: 50400000,
        nightLength: 36000000,
        cloudy: false,
        rainy: false,
        snowy: false,
        foggy: false,
        // location: 'Kyiv, Ukraine', // TODO: must be added by main service
        // currentTimeString: '19:00', // TODO: must be added by main service
        // currentDate: '5 Mar 2019', // TODO: must be added by main service
    };

    public weatherState: WeatherState = {
        weatherType: WeatherTypes.dayLightClouds,
        weatherDefinition: WeatherDefinitions.dayLightClouds,
        temperatureCurrent: 19,
        temperatureFeelsLike: 14,
        temperatureMin: 15,
        temperatureMax: 25,
        humidityCurrent: 5,
        humidityMin: 2.5,
        humidityMax: 7.5,
        windSpeed: 4.5,
        uvIndex: 3,
        airPressure: 745,
        windDirection: WindDirections.northEast,
        moonPhase: MoonPhases.waningCrescent,
    };

    constructor() { }
}
