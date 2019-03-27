import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewRef,
} from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { MainService } from '../../../services/main.service';

import {
    DropsOnScreen,
    Overcast,
    State,
    TimeOfDay,
} from '../../../../../shared/public-api';

@Component({
    selector: 'app-weather-effect-water-drops',
    templateUrl: './weather-effect-water-drops.component.html',
    styleUrls: ['./weather-effect-water-drops.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('enterLeaveTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('1s', style({ opacity: 0 }))
            ])
        ]),
    ],
})
export class WeatherEffectWaterDropsComponent implements OnInit, OnChanges {
    @Input() viewHeight: number;
    @Input() viewWidth: number;
    @Input() overcast: Overcast;
    @Input() currentBackground: string;

    public drops: any[] = [];
    public borders: any[] = [];
    public currentState: State;

    private numberOfDrops = 100;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
        });
    }

    ngOnInit() {
        this.numberOfDrops = DropsOnScreen[this.overcast];
        this.generateDrops();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('overcast' in changes && !changes.overcast.firstChange) {
            this.drops = [];
            this.borders = [];
            this.generateDrops();
        }
    }

    private randomTimeout(): number {
        return Math.random() * 10000;
    }

    private generateDrops(): void {
        const changeDetectorRef = this.changeDetectorRef;

        function detectChanges(): void {
            if (!(<ViewRef>changeDetectorRef).destroyed) {
                changeDetectorRef.detectChanges();
            }
        }

        for (let i = 0; i < this.numberOfDrops; i++) {
            setTimeout(() => {
                const x = Math.random();
                const y = Math.random();

                const dropWidth = Math.random() * 11 + 6;
                const dropHeight = dropWidth * ((Math.random() * 0.5) + 0.7);
                const borderHeight = 0.95 * dropHeight;

                const xPosition =  x * this.viewWidth;
                const yPosition =  y * this.viewHeight;

                const backgroundPosition = `${x * 100}% ${y * 100}%`;
                const backgroundSize = `${this.viewHeight / 100 * 5}px ${this.viewWidth / 100 * 5}px`;

                const borderWidth = dropWidth - 4;

                this.drops.push({
                    xPosition,
                    yPosition,
                    dropWidth,
                    dropHeight,
                    backgroundPosition,
                    backgroundSize,
                });

                this.borders.push({
                    xPosition,
                    yPosition,
                    borderWidth,
                    // dropHeight,
                    borderHeight,
                });

                detectChanges();
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
}
