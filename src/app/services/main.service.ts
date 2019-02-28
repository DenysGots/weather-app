import {
    Injectable,
    OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

import { HttpService } from './http.service';
import { StateService } from './state.service';

import { State, TimeOfDay } from '../interfaces/public-api';

@Injectable()
export class MainService implements OnInit {
    public currentState: State;
    public currentStateSubject: Observable<State>;

    private currentStateSource: BehaviorSubject<State>;

    constructor(private httpService: HttpService,
                private stateService: StateService) {
        this.setCurrentState();
        this.currentStateSource = new BehaviorSubject(this.currentState);
        this.currentStateSubject = this.currentStateSource.asObservable();
    }

    ngOnInit () { }

    public setCurrentState(): void {
        this.currentState = {...this.stateService.currentState};
        this.setCurrentTime();
        this.setTimeOfDay();
        this.defineSkyBackground();
    }

    public emitState(state: State): void {
        this.currentStateSource.next(state);
    }

    public setCurrentTime(): void {
        const currentTime: moment.Moment = moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        this.currentState.currentTime = moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
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
