import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-sun',
    templateUrl: './weather-effect-sun.component.html',
    styleUrls: ['./weather-effect-sun.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectSunComponent {
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    constructor() { }
}
