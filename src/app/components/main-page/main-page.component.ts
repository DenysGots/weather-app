import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import {
    Overcast,
    State,
    TimeOfDay,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
