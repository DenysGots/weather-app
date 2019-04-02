import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _cloneDeep from 'lodash/cloneDeep';

import { HttpService } from './http.service';
import { StateService } from './state.service';

import { State } from '../interfaces/public-api';

@Injectable()
export class MainService {
    public currentState: State;
    public currentStateSubject: Observable<State>;

    private currentStateSource: BehaviorSubject<State>;

    constructor(private httpService: HttpService,
                private stateService: StateService) {
        this.getLocation();

        // TODO: change method to get state from LS, if present
        // this.getCurrentState();
        this.currentState = _cloneDeep(this.stateService.getStateFromLocalStorage());

        this.currentStateSource = new BehaviorSubject(this.currentState);
        this.currentStateSubject = this.currentStateSource.asObservable();
    }

    public getLocation(): void {
        this.httpService.getLocation(locationData => {
            this.stateService.locationData = locationData;
            this.getWeather();
        });
    }

    public getWeather(): void {
        this.httpService.getWeather().subscribe(weatherData => {
            console.log('Received weather: ', weatherData);

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
}
