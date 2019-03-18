import { Injectable } from '@angular/core';

import {
    MoonPhases,
    Overcast,
    State,
    WeatherDefinitions,
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

    public adjustReceivedData(weatherData: any) {
        // TODO: transform received data into currentState: State
        // TODO: update State interface
    }
}
