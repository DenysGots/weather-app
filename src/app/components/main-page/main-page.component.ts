import { Component } from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { MainService } from '../../services/main.service';

import {
    Overcast,
    State,
    TimeOfDay,
} from '../../../../shared/public-api';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    animations: [
        trigger('enterLeaveTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('1s', style({ opacity: 0 }))
            ])
        ]),
    ],
})
export class MainPageComponent {
    public currentState: State;

    constructor(private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
        });
    }

    public getCurrentBackgroundClass(): any {
        const currentBackgroundClass = {};
        currentBackgroundClass[this.currentState.currentBackground] = true;
        return currentBackgroundClass;
    }

    public isOvercast(type): boolean {
        return this.currentState.overcast === Overcast[type];
    }

    public isTimeOfDay(time): boolean {
        return this.currentState.timeOfDay === TimeOfDay[time];
    }

    public isWeather(weather: string): boolean {
        return this.currentState[weather];
    }
}
