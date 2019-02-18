import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

import {
    NumberOfClouds,
    Overcast,
    TimeOfDay,
} from '../../../interfaces/public-api';

@Component({
    selector: 'app-weather-effect-cloud',
    templateUrl: './weather-effect-cloud.component.html',
    styleUrls: ['./weather-effect-cloud.component.scss'],
})
export class WeatherEffectCloudComponent implements OnInit {
    @Input() public overcast: Overcast = Overcast.light;
    @Input() public timeOfDay: TimeOfDay = TimeOfDay.day;

    public numberOfClouds: number;

    constructor() { }

    ngOnInit() {
        this.numberOfClouds = NumberOfClouds[this.overcast];
    }

    public isOvercast(type): boolean {
        return this.overcast === Overcast[type];
    }

    public isTimeOfDay(time): boolean {
        return this.timeOfDay === TimeOfDay[time];
    }
}
