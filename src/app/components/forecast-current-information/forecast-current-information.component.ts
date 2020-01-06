import { Component } from '@angular/core';

import { MainService } from '../../services/main.service';
import { State, WeatherTypes } from '../../../../shared/public-api';

@Component({
    selector: 'app-forecast-current-information',
    templateUrl: './forecast-current-information.component.html',
    styleUrls: ['./forecast-current-information.component.scss'],
})
export class ForecastCurrentInformationComponent {
    public currentState: State;

    constructor(private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
        });
    }

    public getWeatherIcon() {
        return this.currentState.weatherType ? this.currentState.weatherType : WeatherTypes.dayClear;
    }

    public getWeatherIconClass(weatherField: string): any {
        const iconClass = {};
        iconClass[this.currentState[weatherField]] = true;
        return iconClass;
    }
}
