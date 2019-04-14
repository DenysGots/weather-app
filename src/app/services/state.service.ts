import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { HelpersService } from './helpers.service';

import { State } from '../interfaces/public-api';

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

        console.log(this.currentState);
    }

    public setLocation(): string {
        return `${this.locationData.geobytescapital}, ${this.locationData.geobytescountry}`;
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

    public getStateFromLocalStorage(): State {
        let weatherState: State;

        if (this.helpersService.isStorageAvailable('localStorage') && localStorage.getItem('lastSavedWeatherState')) {
            weatherState = JSON.parse(localStorage.getItem('lastSavedWeatherState'));
        }

        return weatherState ? weatherState : this.currentState;
    }
}
