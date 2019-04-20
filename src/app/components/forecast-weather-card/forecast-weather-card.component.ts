import {
    Input,
    Component,
    OnInit,
} from '@angular/core';

import {
    CardsDeckType,
    WeatherTypes,
    WindDirections,
} from '../../../../shared/public-api';

@Component({
    selector: 'app-forecast-weather-card',
    templateUrl: './forecast-weather-card.component.html',
    styleUrls: ['./forecast-weather-card.component.scss'],
})
export class ForecastWeatherCardComponent implements OnInit {
    @Input() type: CardsDeckType;
    /* Hours forecast */
    @Input() hourTime: string;
    @Input() weatherTypeHour: WeatherTypes;
    @Input() humidityCurrent: number;
    @Input() temperatureCurrent: number;
    @Input() windSpeedCurrent: number;
    @Input() windDirectionCurrent: WindDirections;
    @Input() uvIndexCurrent: number;
    /* Days forecast */
    @Input() dayDate: string;
    @Input() weatherTypeDay: WeatherTypes;
    @Input() temperatureMin: number;
    @Input() temperatureMax: number;
    @Input() humidity: number;
    @Input() uvIndex: number;

    constructor() { }

    ngOnInit() { }

    public isCurrentType(type: string) {
        return type === this.type;
    }

    public getWindDirectionIconClass(): any {
        const iconClass = {};
        iconClass[this.windDirectionCurrent] = true;
        return iconClass;
    }
}
