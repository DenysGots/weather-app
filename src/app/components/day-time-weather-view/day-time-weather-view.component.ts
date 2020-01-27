import { takeWhile } from 'rxjs/operators';

import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { MainService } from '../../services/main.service';
import { Overcast, State } from '../../../../shared/public-api';

@Component({
  selector: 'app-day-time-weather-view',
  templateUrl: './day-time-weather-view.component.html',
  styleUrls: ['./day-time-weather-view.component.scss'],
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
export class DayTimeWeatherViewComponent implements OnInit, OnDestroy {
  public viewHeight: number;
  public viewWidth: number;
  public currentState: State;

  private isAlive = true;

  @ViewChild('weatherView', { static: false }) weatherView: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService
  ) {
    this.mainService.currentStateSubject
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((state: State) => {
        this.currentState = state;
      });
  }

  ngOnInit() {
    this.viewHeight = this.elementRef.nativeElement.offsetHeight;
    this.viewWidth = this.elementRef.nativeElement.offsetWidth;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  public isTimeOfDay(timeOfDay) {
    return this.currentState.timeOfDay === timeOfDay;
  }

  public addLightning(): boolean {
    return this.currentState.rainy && this.currentState.overcast === Overcast.heavy;
  }

  public addDropsOnScreen(): boolean {
    return this.currentState.foggy || this.currentState.rainy;
  }

  public getCurrentBackgroundClass(): any {
    const currentBackgroundClass = {};
    currentBackgroundClass[this.currentState.currentBackground] = true;
    return currentBackgroundClass;
  }

  public withoutHeavyOvercast(): boolean {
    return !(this.currentState.overcast && this.currentState.overcast === Overcast.heavy);
  }
}
