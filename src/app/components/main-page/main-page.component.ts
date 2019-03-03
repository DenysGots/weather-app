import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
    constructor(private mainService: MainService) { }

    public getCurrentBackgroundClass(): any {
        const currentBackgroundClass = {};
        currentBackgroundClass[this.mainService.currentState.currentBackground] = true;
        return currentBackgroundClass;
    }
}
