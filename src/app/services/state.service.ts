import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _isNil from 'lodash/isNil';

import { HelpersService } from './helpers.service';

import {
    DaysForecast,
    HoursForecast,
    Overcast,
    State,
    TimeOfDay,
    WeatherDefinitions,
    WeatherTypes,
    WindDirections,
} from '../../../shared/public-api';

@Injectable({
    providedIn: 'root',
})
export class StateService {
    public currentState: State = <State>{};
    public locationData: any;

    constructor(private helpersService: HelpersService) { }

    public adjustReceivedData(weatherData: State): void {
        this.currentState = weatherData;
        this.currentState.location = this.setLocation();
        this.currentState.currentDate = this.setCurrentDate();
        this.currentState.currentTimeString = this.setCurrentTimeString();
        this.currentState.currentBackground = this.defineSkyBackground();
        this.currentState.moonPhase = this.helpersService.calculateMoonPhase();
    }

    public setLocation(): string {
        return `${this.locationData.city}, ${this.locationData.country}`;
    }

    public setCurrentDate(): string {
        return moment().format('D MMM YYYY');
    }

    public setCurrentTimeString(): string {
        return moment().format('HH:mm');
    }

    public defineSkyBackground(): string {
        const currentHour: number = moment.duration(this.currentState.currentTime).hours();
        const shouldAdjustCurrentHour: boolean =
            this.currentState.dayLength / this.currentState.nightLength >= 1 ||
            currentHour === 0 ||
            currentHour === 12 ||
            currentHour === 24;

        let adjustedHour: number;
        let adjustedHourFormatted: string;

        adjustedHour = shouldAdjustCurrentHour
            ? currentHour
            : (currentHour < 12)
                ? (currentHour - 1)
                : (currentHour + 1);

        adjustedHourFormatted = moment().hour(adjustedHour).format('HH');
        return `app-sky-gradient-${adjustedHourFormatted}`;
    }

    public saveStateToLocalStorage(): void {
        if (this.helpersService.isStorageAvailable('localStorage')) {
            localStorage.setItem('lastSavedWeatherState', JSON.stringify(this.currentState));
        }
    }

    public getInitialState(): void {
        const isStateSavedInLocalStorage: boolean =
            this.helpersService.isStorageAvailable('localStorage') &&
            !_isNil(localStorage.getItem('lastSavedWeatherState'));

        this.currentState = isStateSavedInLocalStorage
            ? JSON.parse(localStorage.getItem('lastSavedWeatherState'))
            : this.setMockedState();
    }

    public setMockedState(): State {
        const currentDate = this.setCurrentDate();
        const currentTimeString = this.setCurrentTimeString();
        const moonPhase = this.helpersService.calculateMoonPhase();

        return <State>{
            timeOfDay: TimeOfDay.day,
            dayLength: 43200000,
            nightLength: 43200000,
            currentTime: 43200000,
            location: 'Kyiv, Ukraine',
            currentTimeString: currentTimeString,
            currentDate: currentDate,
            currentBackground: `app-sky-gradient-12`,
            cloudy: true,
            rainy: false,
            snowy: false,
            foggy: false,
            overcast: Overcast.light,
            weatherType: WeatherTypes.dayClear,
            weatherDefinition: WeatherDefinitions.dayClear,
            temperatureCurrent: 20,
            temperatureFeelsLike: 25,
            humidityCurrent: 10,
            uvIndex: 1,
            airPressure: 750,
            windSpeed: 1,
            windDirection: WindDirections.eastSouth,
            moonPhase: moonPhase,
            hoursForecast: <HoursForecast>[],
            daysForecast: <DaysForecast>[],
        };
    }
}
