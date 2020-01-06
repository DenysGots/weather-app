import { cloneDeep } from 'lodash/fp';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
    MoonPhases,
    Overcast,
    State,
    TimeOfDay,
    WeatherTypes,
    WindDirections
} from '../../../../shared/public-api';
import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnInit {
    public controlForm: FormGroup;
    public overcastEnum = Overcast;
    public testingState: State = <State>{};
    public isActive = false;

    // This initial values must be here, so control panel will initialize itself without errors
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

    constructor(
        private formBuilder: FormBuilder,
        private mainService: MainService
    ) {}

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
        this.testingState = cloneDeep(this.mainService.currentState);
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

        this.setTimeOfDay();
        this.defineSkyBackground();
        this.mainService.currentState = cloneDeep(this.testingState);
        this.mainService.emitCurrentState();
    }

    public resetState(): void {
        this.mainService.setCurrentState();
        this.mainService.emitCurrentState();
        this.getState();
        this.setFormValues();
    }

    public setTimeOfDay(): void {
        const currentHour: number = moment.duration(this.testingState.currentTime).hours();
        const dayHours: number = moment.duration(this.testingState.dayLength).hours();
        const nightHours: number = moment.duration(this.testingState.nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        this.testingState.timeOfDay = isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public defineSkyBackground(): void {
        const currentHour: number = moment.duration(this.testingState.currentTime).hours();
        const shouldAdjustCurrentHour: boolean =
            this.testingState.dayLength / this.testingState.nightLength >= 1 ||
            currentHour === 0 ||
            currentHour === 12 ||
            currentHour === 24;

        let adjustedHour: number;
        let adjustedHourFormatted: string;

        adjustedHour = shouldAdjustCurrentHour
            ? currentHour
            : (currentHour < 12)
                ? (currentHour - 1)
                : (currentHour + 1);

        adjustedHourFormatted = moment().hour(adjustedHour).format('HH');
        this.testingState.currentBackground = `app-sky-gradient-${adjustedHourFormatted}`;
    }

    private millisecondsToHours(time: number): number {
        return moment.duration(time).hours();
    }

    private hoursToMilliseconds(time: number): number {
        const currentTime: moment.Moment = moment().hours(time);
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }
}
