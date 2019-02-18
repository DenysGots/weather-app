import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import { Overcast, TimeOfDay } from '../../interfaces/public-api';

@Component({
    selector: 'app-day-time-weather-view',
    templateUrl: './day-time-weather-view.component.html',
    styleUrls: ['./day-time-weather-view.component.scss'],
    animations: [
        // TODO: add animation here for components: for ngIfs ease-in-out
    ],
})
export class DayTimeWeatherViewComponent implements OnInit {
    public timeOfDay: TimeOfDay;
    public overcast: Overcast;

    public dayLength: number; // milliseconds
    public nightLength: number; // milliseconds
    public currentTime: number; // milliseconds since midnight

    public withoutHeavyOvercast: boolean;
    public cloudy: boolean;
    public rainy: boolean;
    public snowy: boolean;
    public foggy: boolean;

    public viewHeight: number;
    public viewWidth: number;

    public currentBackground: string;

    @ViewChild('weatherView') weatherView: ElementRef;

    constructor(private elementRef: ElementRef,
                private changeDetectorRef: ChangeDetectorRef,
                private mainService: MainService) {
        this.timeOfDay = mainService.timeOfDay;
        this.overcast = mainService.overcast;
        this.dayLength = mainService.dayLength;
        this.nightLength = mainService.nightLength;
        this.currentTime = mainService.currentTime;
        this.cloudy = mainService.cloudy;
        this.rainy = mainService.rainy;
        this.snowy = mainService.snowy;
        this.foggy = mainService.foggy;
        this.currentBackground = mainService.currentBackground;
    }

    ngOnInit() {
        this.withoutHeavyOvercast = !(this.overcast && this.overcast === Overcast.heavy);

        /* TODO: this ones are calculated wrongly in Firefox, needs to be fixed somehow */
        this.viewHeight = this.elementRef.nativeElement.offsetHeight;
        this.viewWidth = this.elementRef.nativeElement.offsetWidth;
        this.changeDetectorRef.detectChanges();
        /*  */
    }

    public isTimeOfDay(timeOfDay) {
        return this.timeOfDay === timeOfDay;
    }

    public addLightning(): boolean {
        return this.rainy && this.overcast === Overcast.heavy;
    }

    public addDropsOnScreen(): boolean {
        return this.foggy || this.rainy;
    }
}
