import {
    Component,
    Input,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-day-time-day-view',
    templateUrl: './day-time-day-view.component.html',
    styleUrls: ['./day-time-day-view.component.scss']
})
export class DayTimeDayViewComponent implements OnInit {
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    constructor() { }

    ngOnInit() { }
}
