import {
    Input,
    Component,
    OnInit,
} from '@angular/core';

import { CardsDeckType } from '../../interfaces/public-api';

@Component({
    selector: 'app-forecast-weather-card',
    templateUrl: './forecast-weather-card.component.html',
    styleUrls: ['./forecast-weather-card.component.scss']
})
export class ForecastWeatherCardComponent implements OnInit {
    // TODO: adjust styles according to type
    @Input() type: CardsDeckType;

    // TODO: get state from cardsDeck
    // TODO: create interface for weatherState
    // @Input() weatherState: any;

    public weatherState: any = {
        timeCurrent: '19:00', // TODO: use Moment for generating this string
        dateCurrent: '5 Mar', // TODO: use Moment for generating this string
        weatherType: 'cloudy', // TODO: create enum for all weather types, use as weather icon type binding
        temperatureCurrent: -19, // TODO: create pipe to add + sign in front of temperature
        temperatureMin: -15,
        temperatureMax: 25,
        humidityCurrent: 5,
        humidityMin: 2.5,
        humidityMax: 7.5,
        windSpeed: 4.5,
        windDirection: '',
        airPressure: 745,
    };

    constructor() { }

    ngOnInit() { }

    public isCurrentType(type: string) {
        return type === this.type;
    }
}
