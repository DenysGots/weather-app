import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';

import {
    NumberOfClouds,
    Overcast,
    TimeOfDay,
} from '../../../../../shared/public-api';

@Component({
    selector: 'app-weather-effect-cloud',
    templateUrl: './weather-effect-cloud.component.html',
    styleUrls: ['./weather-effect-cloud.component.scss'],
    animations: [
        trigger('enterLeaveTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('1s', style({ opacity: 0 }))
            ])
        ]),
    ],
})
export class WeatherEffectCloudComponent implements OnInit, OnChanges {
    @Input() public overcast: Overcast = Overcast.light;
    @Input() public timeOfDay: TimeOfDay = TimeOfDay.day;

    public numberOfClouds: number;

    constructor() { }

    ngOnInit() {
        this.numberOfClouds = NumberOfClouds[this.overcast];
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('overcast' in changes && !changes.overcast.firstChange) {
            this.numberOfClouds = NumberOfClouds[this.overcast];
        }
    }

    public isOvercast(type): boolean {
        return this.overcast === Overcast[type];
    }

    public isTimeOfDay(time): boolean {
        return this.timeOfDay === TimeOfDay[time];
    }
}
