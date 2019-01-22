import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-day-time-night-view',
    templateUrl: './day-time-night-view.component.html',
    styleUrls: ['./day-time-night-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeNightViewComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
