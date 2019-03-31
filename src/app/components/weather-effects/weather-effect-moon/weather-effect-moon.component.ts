import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-weather-effect-moon',
    templateUrl: './weather-effect-moon.component.html',
    styleUrls: ['./weather-effect-moon.component.scss']
})
export class WeatherEffectMoonComponent {
    // TODO: add moon phases with different box-shadow, according to current state

    @Input() viewHeight: number;
    @Input() viewWidth: number;

    constructor() { }
}
