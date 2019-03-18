import { Component } from '@angular/core';

import { MainService } from '../../services/main.service';
import { State } from '../../interfaces/public-api';

@Component({
    selector: 'app-forecast-current-information',
    templateUrl: './forecast-current-information.component.html',
    styleUrls: ['./forecast-current-information.component.scss']
})
export class ForecastCurrentInformationComponent {
    // TODO: reset state on Weather Card click / Home click

    public currentState: State;

    constructor(private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
        });
    }

    public getWeatherIconClass(weatherField: string): any {
        const iconClass = {};
        iconClass[this.currentState[weatherField]] = true;
        return iconClass;
    }
}
