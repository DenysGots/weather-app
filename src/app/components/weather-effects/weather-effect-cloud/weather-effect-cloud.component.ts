import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

enum Overcast {
    light = 'light',
    medium = 'medium',
    heavy = 'heavy',
}

enum NumberOfClouds {
    light = 4,
    medium = 8,
    heavy = 12,
}

enum TimeOfDay {
    day = 'day',
    night = 'night'
}

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
