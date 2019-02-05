import {
    Component,
    Input,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-moon',
    templateUrl: './weather-effect-moon.component.html',
    styleUrls: ['./weather-effect-moon.component.scss']
})
export class WeatherEffectMoonComponent implements OnInit {
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    constructor() { }

    ngOnInit() { }
}
