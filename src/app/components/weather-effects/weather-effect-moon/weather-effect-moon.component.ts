import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';

import { MoonPhases } from '../../../../../shared/public-api';

@Component({
    selector: 'app-weather-effect-moon',
    templateUrl: './weather-effect-moon.component.html',
    styleUrls: ['./weather-effect-moon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectMoonComponent {
    @Input() viewHeight: number;
    @Input() viewWidth: number;
    @Input() moonPhase: MoonPhases;

    constructor() { }

    public getMoonPhaseClass(): {[key: string]: boolean} {
        const moonPhaseClass = {};
        let moonPhaseClassString: string;

        switch (this.moonPhase) {
            case MoonPhases.newMoon:
                moonPhaseClassString = 'app-weather-effect-moon__phase-0';
                break;

            case MoonPhases.waxingCrescent:
                moonPhaseClassString = 'app-weather-effect-moon__phase-14';
                break;

            case MoonPhases.firstQuarter:
                moonPhaseClassString = 'app-weather-effect-moon__phase-28';
                break;

            case MoonPhases.waxingGibbous:
                moonPhaseClassString = 'app-weather-effect-moon__phase-42';
                break;

            case MoonPhases.full:
                moonPhaseClassString = 'app-weather-effect-moon__phase-57';
                break;

            case MoonPhases.waningGibbous:
                moonPhaseClassString = 'app-weather-effect-moon__phase-71';
                break;

            case MoonPhases.thirdQuarter:
                moonPhaseClassString = 'app-weather-effect-moon__phase-86';
                break;

            case MoonPhases.waningCrescent:
                moonPhaseClassString = 'app-weather-effect-moon__phase-100';
                break;

            default:
                moonPhaseClassString = 'app-weather-effect-moon__phase-71';
        }

        moonPhaseClass[moonPhaseClassString] = true;

        return moonPhaseClass;
    }
}
