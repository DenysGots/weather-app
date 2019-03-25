import { Component, OnInit } from '@angular/core';
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
        this.getState();

        this.controlForm = new FormGroup({
            overcast: new FormControl({
                value: this.testingState.overcast,
                disabled: !this.isActive
            }),
            cloudy: new FormControl({
                value: this.testingState.cloudy,
                disabled: !this.isActive
            }),
            rainy: new FormControl({
                value: this.testingState.rainy,
                disabled: !this.isActive
            }),
            snowy: new FormControl({
                value: this.testingState.snowy,
                disabled: !this.isActive
            }),
            foggy: new FormControl({
                value: this.testingState.foggy,
                disabled: !this.isActive
            }),
            currentTime: new FormControl({
                value: this.millisecondsToHours(this.testingState.currentTime),
                disabled: !this.isActive
            }),
        });
    }

    public getState(): void {
        this.testingState = {...this.mainService.currentState};
    }

    public setFormValues(): void {
        const newFormValue = {};

        for (const prop in this.controlForm.value) {
            if (this.controlForm.value.hasOwnProperty(prop)) {
                newFormValue[prop] = this.testingState[prop];
            }
        }

        newFormValue['currentTime'] = this.millisecondsToHours(this.testingState.currentTime);
        this.controlForm.setValue(newFormValue);
    }

    public toggleControlPanel() {
        this.getState();
        this.setFormValues();

        this.isActive = !this.isActive;

        (this.isActive) ? this.controlForm.enable() : this.controlForm.disable();

        if (!this.isActive) {
            this.resetState();
        }
    }

    public overrideState(): void {
        for (const prop in this.controlForm.value) {
            if (this.controlForm.value.hasOwnProperty(prop)) {
                this.testingState[prop] = this.controlForm.value[prop];
            }
        }

        this.testingState.currentTime = this.hoursToMilliseconds(this.controlForm.value.currentTime);
        this.mainService.currentState = {...this.testingState};
        this.mainService.setTimeOfDay();
        this.mainService.defineSkyBackground();
        this.mainService.emitCurrentState();
    }

    public resetState(): void {
        this.mainService.getCurrentState();
        this.mainService.setCurrentState();
        this.mainService.emitCurrentState();
        this.getState();
        this.setFormValues();
    }

    public millisecondsToHours(time: number): number {
        return moment.duration(time).hours();
    }

    public hoursToMilliseconds(time: number): number {
        const currentTime: moment.Moment = moment().hours(time).minutes(0).seconds(0).millisecond(0);
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }
}
