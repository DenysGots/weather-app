import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';

@Component({
    selector: 'app-day-time-weather-view',
    templateUrl: './day-time-weather-view.component.html',
    styleUrls: ['./day-time-weather-view.component.scss'],
    animations: [
        // TODO: add animation here for components: for ngIfs ease-in-out
    ],
})
export class DayTimeWeatherViewComponent implements OnInit {
    @ViewChild('weatherView') weatherView: ElementRef;

    public viewHeight: number;
    public viewWidth: number;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        this.viewHeight = this.elementRef.nativeElement.offsetHeight;
        this.viewWidth = this.elementRef.nativeElement.offsetWidth;
    }
}
