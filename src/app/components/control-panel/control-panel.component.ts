import {
    Component,
    OnInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { MainService } from '../../services/main.service';
import { Overcast, State } from '../../interfaces/public-api';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
    public controlForm: FormGroup;
    public overcastEnum = Overcast;
    public testingState: State;
    public isActive = false;

    constructor(private mainService: MainService) { }

    ngOnInit() {
        this.testingState = Object.assign({}, this.mainService.currentState);

        this.controlForm = new FormGroup({
            overcast: new FormControl({value: this.testingState.overcast, disabled: !this.isActive}),
            cloudy: new FormControl({value: this.testingState.cloudy, disabled: !this.isActive}),
            rainy: new FormControl({value: this.testingState.rainy, disabled: !this.isActive}),
            snowy: new FormControl({value: this.testingState.snowy, disabled: !this.isActive}),
            foggy: new FormControl({value: this.testingState.foggy, disabled: !this.isActive}),
            currentTime: new FormControl({value: this.millisecondsToHours(this.testingState.currentTime), disabled: !this.isActive}),
        });
    }

    public toggleControlPanel() {
        this.isActive = !this.isActive;

        (this.isActive) ? this.controlForm.enable() : this.controlForm.disable();

        if (!this.isActive) {
            this.resetState();
        }
    }

    public overrideState(): void {
        // TODO: on currentTime change must somehow trigger CelestialPosition recalculate in day/night views

        this.testingState = Object.assign({}, this.controlForm.value);
        this.testingState.currentTime = this.hoursToMilliseconds(this.controlForm.value.currentTime);
        this.mainService.currentState = Object.assign({}, this.testingState);
        this.mainService.setTimeOfDay();
        this.mainService.defineSkyBackground();

        // TODO: emmit mainService
    }

    public resetState(): void {
        this.mainService.resetState();
        this.testingState = Object.assign({}, this.mainService.currentState);
    }

    public millisecondsToHours(time: number): number {
        return moment.duration(time).asHours();
    }

    public hoursToMilliseconds(time: number): number {
        const currentTime = moment().hours(time).minutes(0).seconds(0).millisecond(0);
        const startOfDay = moment().startOf('hour').hour(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }
}
