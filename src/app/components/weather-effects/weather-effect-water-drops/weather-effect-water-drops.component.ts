import { interval } from 'rxjs';
import { takeWhile, throttle } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
  ViewRef
} from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import { MainService } from '../../../services/main.service';
import {
  CelestialData,
  DropsOnScreen,
  moonSize,
  Overcast,
  spaceMd,
  State,
  TimeOfDay,
  WaterDrop
} from '../../../../../shared/public-api';

@Component({
  selector: 'app-weather-effect-water-drops',
  templateUrl: './weather-effect-water-drops.component.html',
  styleUrls: ['./weather-effect-water-drops.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
export class WeatherEffectWaterDropsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() viewHeight: any;
  @Input() viewWidth: any;
  @Input() overcast: Overcast;
  @Input() currentBackground: string;

  public drops: WaterDrop[] = [];
  public currentState: State;
  public adjustedCelestialData: {[key: string]: number} = {};

  private numberOfDrops = 100;
  private isAlive = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private mainService: MainService
  ) {
    this.mainService.currentStateSubject
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((state: State) => {
        this.currentState = state;
      });

    this.mainService.celestialDataSubject
      .pipe(
        takeWhile(() => this.isAlive),
        throttle(val => interval(5000))
      )
      .subscribe((data: CelestialData) => {
        this.adjustCelestialPosition(data);
        this.initDropsWeatherEffect();
        // !(<ViewRef>changeDetectorRef).destroyed && this.changeDetectorRef.detectChanges();
      });
  }

  ngOnInit() {
    this.initDropsWeatherEffect();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('overcast' in changes && !changes.overcast.firstChange) {
      this.initDropsWeatherEffect();
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  private initDropsWeatherEffect() {
    this.drops = [];
    this.numberOfDrops = DropsOnScreen[this.overcast];

    // TODO: test
    this.ngZone.runOutsideAngular(() => {
      this.generateDrops();
    });


    // this.generateDrops();
  }

  private randomTimeout(): number {
    return Math.random() * 10000;
  }

  // Taken from https://codepen.io/anon/pen/wRqQOJ
  private generateDrops(): void {
    const changeDetectorRef = this.changeDetectorRef;

    function detectChanges(): void {
      !(<ViewRef>changeDetectorRef).destroyed && changeDetectorRef.detectChanges();
    }

    for (let i = 0; i < this.numberOfDrops; i++) {
      setTimeout(() => {
        const x = Math.random();
        const y = Math.random();

        const dropWidth = Math.random() * 11 + 6;
        const dropHeight = dropWidth * ((Math.random() * 0.5) + 0.7);

        const borderWidth = dropWidth - 4;
        const borderHeight = 0.94 * dropHeight;

        const xPosition =  x * parseFloat(this.viewWidth);
        const yPosition =  y * parseFloat(this.viewHeight);

        const backgroundPosition = `${x * 100}% ${y * 100}%`;
        const backgroundSize =
          `${parseFloat(this.viewHeight) / 100 * 5}px ${parseFloat(this.viewWidth) / 100 * 5}px`;

        const fogBackground =
          this.isWeather('foggy') || this.isWeather('cloudy');
        const dayMediumBackground =
          this.isWeather('cloudy') && this.isOvercast('medium') && this.isTimeOfDay('day');
        const dayHeavyBackground =
          this.isWeather('cloudy') && this.isOvercast('heavy') && this.isTimeOfDay('day');
        const nightMediumBackground =
          this.isWeather('cloudy') && this.isOvercast('medium') && this.isTimeOfDay('night');
        const nightHeavyBackground =
          this.isWeather('cloudy') && this.isOvercast('heavy') && this.isTimeOfDay('night');

        const generatedDrop = <any>{
          xPosition,
          yPosition,
          dropWidth,
          dropHeight,
          borderWidth,
          borderHeight,
          backgroundPosition,
          backgroundSize,
          fogBackground,
          dayMediumBackground,
          dayHeavyBackground,
          nightMediumBackground,
          nightHeavyBackground
        };

        generatedDrop.shouldRender = this.shouldRenderDrop(generatedDrop);

        this.drops.push(generatedDrop);

        // console.log(this.drops);


        // TODO: test
        this.ngZone.run(() => {
          detectChanges();
        });

        // detectChanges();
      }, this.randomTimeout());
    }
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

  public adjustCelestialPosition(data: CelestialData): void {
    this.adjustedCelestialData = {};

    if (data && 'celestial' in data) {
      for (const prop in data.celestial) {
        if (data.celestial.hasOwnProperty(prop)) {
          this.adjustedCelestialData[prop] = parseInt(data.celestial[prop], 10);
        }
      }
    }
  }

  public shouldRenderDrop(drop: WaterDrop): boolean {
    const celestial = this.adjustedCelestialData;
    const yPosition = this.viewHeight - drop.yPosition - drop.dropHeight;

    return celestial
      ? (
        (drop.xPosition > celestial.x + moonSize + spaceMd || drop.xPosition + drop.dropWidth < celestial.x - spaceMd)
        &&
        (yPosition > celestial.y + spaceMd || yPosition + drop.dropHeight < celestial.y - moonSize - spaceMd)
      )
      : true;
  }
}
