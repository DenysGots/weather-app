import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
    // TODO: get this from main service and apply this class + filter over as a page background
    public currentBackground: string;

    constructor() { }

    ngOnInit() { }
}
