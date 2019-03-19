import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
    MoonPhases,
    Overcast,
    State,
    WeatherDefinitions,
    WeatherTypes,
    WindDirections,
    ApixuWeatherCodes,
} from '../interfaces/public-api';

export interface State {
    dayLength?: number;   // TODO
    nightLength?: number;   // done
    cloudy?: boolean;   // done
    rainy?: boolean;   // done
    snowy?: boolean;   // done
    foggy?: boolean;   // done
    overcast?: Overcast;   // done
    weatherType?: WeatherTypes;   // TODO
    weatherDefinition?: WeatherDefinitions;   // done
    temperatureCurrent?: number;   // done
    temperatureFeelsLike?: number;   // done
    humidityCurrent?: number;   // done
    uvIndex?: number;   // done
    airPressure?: number;   // done
    windSpeed?: number;   // done
    windDirection?: WindDirections;
    moonPhase?: MoonPhases;   // TODO: find api to import this

    hoursForecast?: HoursForecast[];   // TODO
    daysForecast?: DaysForecast[];   // TODO
}

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
        humidityCurrent: 5,
        windSpeed: 4.5,
        uvIndex: 3,
        airPressure: 745,
        windDirection: WindDirections.northEast,
        moonPhase: MoonPhases.waningCrescent,  // TODO: get this from some API
    };

    constructor() { }

    // TODO: move logic to server, copy interfaces to server
    public adjustReceivedData(weatherData: any) {
        // TODO: transform received data into currentState: State

        this.currentState.dayLength = this.setDayLength(weatherData[0].forecast.forecastday[0].astro);
        this.currentState.nightLength = this.setNightLength();
        this.currentState.humidityCurrent = weatherData[0].current.humidity;
        this.currentState.temperatureCurrent = weatherData[0].current.temp_c;
        this.currentState.temperatureFeelsLike = weatherData[0].current.feelslike_c;
        this.currentState.airPressure = weatherData[0].current.pressure_mb / 1.333;
        this.currentState.uvIndex = weatherData[0].current.uv;
        this.currentState.windSpeed = weatherData[0].current.wind_kph;
        this.currentState.weatherDefinition = weatherData[0].current.condition.text;
        this.currentState.foggy = this.isFog(weatherData[0].current.condition.code);
        this.currentState.cloudy = this.isCloud(weatherData[0].current.condition.code);
        this.currentState.rainy = this.isRain(weatherData[0].current.condition.code);
        this.currentState.snowy = this.isSnow(weatherData[0].current.condition.code);
    }

    public isFog(code) {
        return ApixuWeatherCodes.fogCodes.indexOf(code) !== -1;
    }

    public isCloud(code) {
        for (const prop in ApixuWeatherCodes.cloudsCodes) {
            if (ApixuWeatherCodes.cloudsCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.cloudsCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public isRain(code) {
        for (const prop in ApixuWeatherCodes.rainCodes) {
            if (ApixuWeatherCodes.rainCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.rainCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public isSnow(code) {
        for (const prop in ApixuWeatherCodes.snowCodes) {
            if (ApixuWeatherCodes.snowCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.snowCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public setDayLength(astroData) {
        const sunRise = astroData.sunrise; // "06:04 AM"
        const sunSet = astroData.sunset; // "06:08 PM"

        const currentTime: moment.Moment = moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);


        // TODO: finish method
    }

    public setNightLength() {
        return 86400000 - this.currentState.dayLength;
    }
}
