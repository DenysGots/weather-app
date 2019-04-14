import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _cloneDeep from 'lodash/cloneDeep';

import { HttpService } from './http.service';
import { StateService } from './state.service';

import { CelestialData, State } from '../../../shared/public-api';

@Injectable({
    providedIn: 'root',
})
export class MainService {
    public currentState: State;
    public celestialData: CelestialData;
    public currentStateSubject: Observable<State>;
    public celestialDataSubject: Observable<CelestialData>;

    private currentStateSource: BehaviorSubject<State>;
    private celestialDataSource: BehaviorSubject<CelestialData>;

    constructor(private httpService: HttpService,
                private stateService: StateService) {
        this.getLocation();
        this.currentState = this.stateService.getStateFromLocalStorage();
        this.currentStateSource = new BehaviorSubject(this.currentState);
        this.celestialDataSource = new BehaviorSubject(this.celestialData);
        this.currentStateSubject = this.currentStateSource.asObservable();
        this.celestialDataSubject = this.celestialDataSource.asObservable();
    }

    public getLocation(): void {
        this.httpService.getLocation(locationData => {
            this.stateService.locationData = locationData;
            this.getWeather();
        });
    }

    public getWeather(): void {
        this.httpService.getWeather().subscribe(weatherData => {
            this.stateService.adjustReceivedData(weatherData);
            this.stateService.saveStateToLocalStorage();
            this.getCurrentState();
            this.emitCurrentState();
        });
    }

    public getCurrentState(): void {
        this.currentState = _cloneDeep(this.stateService.currentState);
    }

    public emitCurrentState(): void {
        this.currentStateSource.next(this.currentState);
    }

    public setCelestialData(celestial: CelestialData) {
        this.celestialData = celestial;
        this.celestialDataSource.next(this.celestialData);
    }
}
