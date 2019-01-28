import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

// export type Overcast = 'light' | 'medium' | 'heavy';
export enum Overcast {
    light = 'light',
    medium = 'medium',
    heavy = 'heavy',
}

export enum TimeOfDay {
    day = 'day',
    night = 'night'
}

@Component({
    selector: 'app-weather-effect-cloud',
    templateUrl: './weather-effect-cloud.component.html',
    styleUrls: ['./weather-effect-cloud.component.scss'],
})
export class WeatherEffectCloudComponent implements OnInit {
    // @Input() public overcast: Overcast<string> = 'heavy';
    @Input() public overcast: Overcast = Overcast.heavy;
    @Input() public timeOfDay: TimeOfDay = TimeOfDay.day;

    constructor() { }

    ngOnInit() { }

    public isOvercast(type): boolean {
        return this.overcast === Overcast[type];
    }

    public isTimeOfDay(time): boolean {
        return this.timeOfDay === TimeOfDay[time];
    }
}
