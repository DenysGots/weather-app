import { takeWhile } from 'rxjs/operators';

import { Component, OnDestroy } from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import { MainService } from '../../services/main.service';
import {
  Overcast,
  State,
  TimeOfDay
} from '../../../../shared/public-api';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [
    trigger('enterLeaveTrigger', [
      transition(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('1s', style({ opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          animate('1s', style({ opacity: 0 }))
        ]
      )
    ])
  ]
})
export class MainPageComponent implements OnDestroy {
  public currentState: State;
  private isAlive = true;

  constructor(private mainService: MainService) {
    this.mainService.currentStateSubject
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((state: State) => {
        this.currentState = state;
      });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  public getCurrentBackgroundClass(): any {
    const currentBackgroundClass = {};
    currentBackgroundClass[this.currentState.currentBackground] = true;
    return currentBackgroundClass;
  }

  public isOvercast(type): boolean {
    return this.currentState.overcast === Overcast[type];
  }

  public isTimeOfDay(time): boolean {
    return this.currentState.timeOfDay === TimeOfDay[time];
  }

  public isWeather(weather: string): boolean {
    return this.currentState[weather];
  }
}
