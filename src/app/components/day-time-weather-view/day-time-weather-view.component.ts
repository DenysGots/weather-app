import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import { Overcast, State } from '../../interfaces/public-api';

@Component({
    selector: 'app-day-time-weather-view',
    templateUrl: './day-time-weather-view.component.html',
    styleUrls: ['./day-time-weather-view.component.scss'],
    animations: [
        // TODO: add animation here for components: for ngIfs ease-in-out
    ],
})
export class DayTimeWeatherViewComponent implements OnInit {
    public viewHeight: number;
    public viewWidth: number;
    public currentState: State;

    @ViewChild('weatherView') weatherView: ElementRef;

    constructor(private elementRef: ElementRef,
                private changeDetectorRef: ChangeDetectorRef,
                private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
        });
    }

    ngOnInit() {
        /* TODO: this ones are calculated wrongly in Firefox, needs to be fixed somehow */
        this.viewHeight = this.elementRef.nativeElement.offsetHeight;
        this.viewWidth = this.elementRef.nativeElement.offsetWidth;
        this.changeDetectorRef.detectChanges();
        /*  */
    }

    public isTimeOfDay(timeOfDay) {
        return this.currentState.timeOfDay === timeOfDay;
    }

    public addLightning(): boolean {
        return this.currentState.rainy && this.currentState.overcast === Overcast.heavy;
    }

    public addDropsOnScreen(): boolean {
        return this.currentState.foggy || this.currentState.rainy;
    }

    public getCurrentBackgroundClass(): any {
        const currentBackgroundClass = {};
        currentBackgroundClass[this.currentState.currentBackground] = true;
        return currentBackgroundClass;
    }

    public withoutHeavyOvercast(): boolean {
        return !(this.currentState.overcast && this.currentState.overcast === Overcast.heavy);
    }
}
