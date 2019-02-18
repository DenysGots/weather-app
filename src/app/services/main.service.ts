import {
    Injectable,
    OnInit,
} from '@angular/core';
import * as moment from 'moment';

import { Overcast, TimeOfDay } from '../interfaces/public-api';

@Injectable()
export class MainService implements OnInit {
    public overcast: Overcast = Overcast.light;
    public timeOfDay: TimeOfDay = TimeOfDay.night;

    public dayLength: number = 50400000; // 14 hours in milliseconds
    public nightLength: number = 3600000; // 10 hours in milliseconds
    public currentTime: number; // milliseconds since midnight

    public cloudy: boolean = false;
    public rainy: boolean = false;
    public snowy: boolean = false;
    public foggy: boolean = false;

    public currentBackground: string;

    constructor() {
        this.setTimeOfDay();
        this.getCurrentTime();
        this.defineSkyBackground();
    }

    ngOnInit () { }

    public resetParameters(): void {
        // TODO: add logic to reset parameters to default (current state) ones
    }

    private setTimeOfDay(): void {
        const currentHour = moment().hour();
        const dayHours = moment.duration(this.dayLength).asHours();
        const nightHours = moment.duration(this.nightLength).asHours();
        const isNight = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);

        this.timeOfDay = isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    private getCurrentTime(): void {
        const currentTime = moment();
        const startOfDay = moment().startOf('hour').hour(0);
        this.currentTime = moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    private defineSkyBackground(): void {
        // TODO: result must be emitted on hourly basis and subscribed by main/day/night/water drops components
        // TODO: if any time left, gradients must be generated every minute or so, instead of every hour
        const currentHour = moment().hour();
        let adjustedHour;

        adjustedHour = (this.dayLength / this.nightLength >= 1 || currentHour === 0 || currentHour === 12 || currentHour === 24)
            ? currentHour
            : (currentHour < 12)
                ? (currentHour - 1)
                : (currentHour + 1);

        adjustedHour = moment().hour(adjustedHour).format('HH');
        this.currentBackground = `app-sky-gradient-${adjustedHour}`;
    }
}
