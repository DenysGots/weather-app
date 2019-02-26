import {
    Input,
    Component,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-forecast-weather-card',
    templateUrl: './forecast-weather-card.component.html',
    styleUrls: ['./forecast-weather-card.component.scss']
})
export class ForecastWeatherCardComponent implements OnInit {
    // TODO: adjust styles according to type
    @Input() type: string;
    // TODO: add inputs for all parameters: temperature, humidity, weather type for icon, etc.
    // bind this info to card parameters for visualisation

    constructor() { }

    ngOnInit() { }
}
