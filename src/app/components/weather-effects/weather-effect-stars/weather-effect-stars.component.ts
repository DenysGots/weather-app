import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-stars',
    templateUrl: './weather-effect-stars.component.html',
    styleUrls: ['./weather-effect-stars.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectStarsComponent {
    constructor() { }
}
