import {
    Injectable,
    OnInit,
} from '@angular/core';
import * as moment from 'moment';

import { HttpService } from './http.service';
import { StateService } from './state.service';

import { State, TimeOfDay } from '../interfaces/public-api';

@Injectable()
export class MainService implements OnInit {
    // TODO: must be emmited on change
    public currentState: State;

    constructor(private httpService: HttpService,
                private stateService: StateService) {
        this.currentState = Object.assign({}, this.stateService.currentState);
        this.setCurrentTime();
        this.setTimeOfDay();
        this.defineSkyBackground();
    }

    ngOnInit () { }

    public setCurrentTime(): void {
        const currentTime = moment();
        const startOfDay = moment().startOf('hour').hour(0);
        this.currentState.currentTime = moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    public setTimeOfDay(): void {
        // const currentHour = moment().hour();
        const currentHour = moment.duration(this.currentState.currentTime).asHours();
        const dayHours = moment.duration(this.currentState.dayLength).asHours();
        const nightHours = moment.duration(this.currentState.nightLength).asHours();
        const isNight = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        this.currentState.timeOfDay = isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public defineSkyBackground(): void {
        // TODO: result must be emitted on hourly basis and subscribed by main/day/night/water drops components
        // TODO: if any time left, gradients must be generated every minute or so, instead of every hour
        // const currentHour = moment().hour();
        const currentHour = moment.duration(this.currentState.currentTime).asHours();
        const shouldAdjustCurrentHour =
            this.currentState.dayLength / this.currentState.nightLength >= 1 ||
            currentHour === 0 ||
            currentHour === 12 ||
            currentHour === 24;

        let adjustedHour;

        adjustedHour = shouldAdjustCurrentHour
            ? currentHour
            : (currentHour < 12)
                ? (currentHour - 1)
                : (currentHour + 1);

        adjustedHour = moment().hour(adjustedHour).format('HH');
        this.currentState.currentBackground = `app-sky-gradient-${adjustedHour}`;
    }

    public resetState(): void {
        this.currentState = Object.assign({}, this.stateService.currentState);
        this.setCurrentTime();
        this.setTimeOfDay();
        this.defineSkyBackground();
    }
}
