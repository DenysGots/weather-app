import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { MainService } from '../../services/main.service';
import { Overcast, TimeOfDay } from '../../interfaces/public-api';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
    // TODO: must implement and visualize current state parameters by default
    // "Reset" button click resets to state's current parameters
    // "Set custom settings" button should enable/disable change of settings

    public controlForm = new FormGroup({
        // firstName: new FormControl(''),
        // lastName: new FormControl(''),
    });

    constructor(private mainService: MainService) { }

    ngOnInit() { }
}
