import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

import { HttpService } from './http.service';
import { StateService } from './state.service';

import {
    State,
    TimeOfDay,
    WeatherState,
} from '../interfaces/public-api';

@Injectable()
export class MainService {
    public currentState: State;
    public weatherState: WeatherState;
    public currentStateSubject: Observable<State>;
    public weatherStateSubject: Observable<WeatherState>;

    private currentStateSource: BehaviorSubject<State>;
    private weatherStateSource: BehaviorSubject<WeatherState>;

    constructor(private httpService: HttpService,
                private stateService: StateService) {
        this.setCurrentState();
        this.currentStateSource = new BehaviorSubject(this.currentState);
        this.currentStateSubject = this.currentStateSource.asObservable();
        this.weatherStateSource = new BehaviorSubject(this.weatherState);
        this.weatherStateSubject = this.weatherStateSource.asObservable();
    }

    public setCurrentState(): void {
        this.currentState = {...this.stateService.currentState};
        this.weatherState = {...this.stateService.weatherState};
        this.getLocation();
        // this.getWeather();
        this.setCurrentTimeString();
        this.setCurrentTime();
        this.setCurrentDate();
        this.setTimeOfDay();
        this.defineSkyBackground();
    }

    public emitState(): void {
        this.currentStateSource.next(this.currentState);
    }

    public setCurrentDate(): void {
        this.currentState.currentDate = moment().format('D MMM YYYY');
    }

    public getLocation(): void {
        this.httpService.getLocation(locationData => {
            this.currentState.location = `${locationData.geobytescapital}, ${locationData.geobytescountry}`;
            this.getWeather();
        });
    }

    public getWeather(): void {
        // TODO: finish this method
        this.httpService.getWeather().subscribe(data => console.log('Received weather: ', data));
    }

    public setCurrentTime(): void {
        const currentTime: moment.Moment = moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        this.currentState.currentTime = moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    public setCurrentTimeString(): void {
        this.currentState.currentTimeString = moment().format('HH:MM');
    }

    public setTimeOfDay(): void {
        const currentHour: number = moment.duration(this.currentState.currentTime).hours();
        const dayHours: number = moment.duration(this.currentState.dayLength).hours();
        const nightHours: number = moment.duration(this.currentState.nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        this.currentState.timeOfDay = isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public defineSkyBackground(): void {
        // TODO: result must be emitted on hourly basis and subscribed by main/day/night/water drops components
        // TODO: if any time left, gradients must be generated every minute or so, instead of every hour

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
        this.currentState.currentBackground = `app-sky-gradient-${adjustedHourFormatted}`;
    }
}
