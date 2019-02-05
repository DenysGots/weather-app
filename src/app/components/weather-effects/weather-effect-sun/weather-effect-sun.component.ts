import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-sun',
    templateUrl: './weather-effect-sun.component.html',
    styleUrls: ['./weather-effect-sun.component.scss']
})
export class WeatherEffectSunComponent implements OnInit {
    // TODO: sun animation can be created here, as a simple x/y coords change in time

    @Input() viewHeight: number;
    @Input() viewWidth: number;

    constructor() { }

    ngOnInit() { }
}
