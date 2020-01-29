import { cloneDeep } from 'lodash/fp';
import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { CelestialData, State } from '../../../shared/public-api';
import { Config } from '../app.config';
import { HttpService } from './http.service';
import { StateService } from './state.service';

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

  constructor(
    private httpService: HttpService,
    private stateService: StateService,
    private config: Config
  ) {
    this.currentStateSource = new BehaviorSubject(this.currentState);
    this.celestialDataSource = new BehaviorSubject(this.celestialData);
    this.currentStateSubject = this.currentStateSource.asObservable();
    this.celestialDataSubject = this.celestialDataSource.asObservable();
    this.stateService.getInitialState();
    this.setCurrentState();
    this.emitCurrentState();
    this.getWeather();
  }

  public getWeather(): void {
    console.log('environment: ', (window as any).environment);
    console.log('config: ', this.config);

    const localDeployment = ['dev', 'local'].includes((window as any).environment.config);
    const setState = (weatherData: State) => {
      this.stateService.adjustReceivedData(weatherData);
      this.stateService.saveStateToLocalStorage();
      this.setCurrentState();
      this.emitCurrentState();
    };

    localDeployment && this.httpService.getIpForLocalDeployment()
      .done((clientIp: string) => this.httpService.getWeatherLocally(clientIp)
        .subscribe((weatherData: State) => setState(weatherData))
      );

    !localDeployment && this.httpService.getWeather()
      .subscribe((weatherData: State) => setState(weatherData));
  }

  public setCurrentState(): void {
    this.currentState = cloneDeep(this.stateService.currentState);
  }

  public emitCurrentState(): void {
    this.currentStateSource.next(this.currentState);
  }

  public setCelestialData(celestial: CelestialData) {
    this.celestialData = celestial;
    this.celestialDataSource.next(this.celestialData);
  }
}
