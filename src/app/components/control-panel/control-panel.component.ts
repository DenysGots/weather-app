import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { MainService } from '../../services/main.service';
import {
    MoonPhases,
    Overcast,
    State,
    WeatherTypes,
    WindDirections,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
    public controlForm: FormGroup;
    public overcastEnum = Overcast;
    public testingState: State = <State>{};
    public isActive = false;

    // TODO: this initial values must be here, so control panel will initialize without errors
    public mockStateData: State = {
        cloudy: false,
        rainy: false,
        snowy: false,
        foggy: false,
        overcast: Overcast.light,
        weatherType: WeatherTypes.dayLightClouds,
        windDirection: WindDirections.northEast,
        moonPhase: MoonPhases.waningCrescent,
        currentTime: 12 * 60 * 60 * 1000,
    };

    constructor(private formBuilder: FormBuilder,
                private mainService: MainService) { }

    ngOnInit() {
        this.getState();
        this.setInitialState();

        this.controlForm = this.formBuilder.group({
            overcast: [{
                value: this.testingState.overcast,
                disabled: !this.isActive,
            }],
            cloudy: [{
                value: this.testingState.cloudy,
                disabled: !this.isActive,
            }],
            rainy: [{
                value: this.testingState.rainy,
                disabled: !this.isActive,
            }],
            snowy: [{
                value: this.testingState.snowy,
                disabled: !this.isActive,
            }],
            foggy: [{
                value: this.testingState.foggy,
                disabled: !this.isActive,
            }],
            currentTime: [{
                value: this.millisecondsToHours(this.testingState.currentTime),
                disabled: !this.isActive,
            }],
        });
    }

    public getState(): void {
        this.testingState = {...this.mainService.currentState};
    }

    public setInitialState(): void {
        for (const prop in this.mockStateData) {
            if (this.mockStateData.hasOwnProperty(prop)) {
                this.testingState[prop] = this.mockStateData[prop];
            }
        }
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
