import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';

import { DropsOnScreen, Overcast } from '../../../interfaces/public-api';

@Component({
    selector: 'app-weather-effect-water-drops',
    templateUrl: './weather-effect-water-drops.component.html',
    styleUrls: ['./weather-effect-water-drops.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectWaterDropsComponent implements OnInit {
    @Input() viewHeight: number;
    @Input() viewWidth: number;
    @Input() overcast: Overcast;
    @Input() currentBackground: string;

    public drops: any[] = [];
    public borders: any[] = [];

    private numberOfDrops = 100;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.numberOfDrops = DropsOnScreen[this.overcast];
        this.generateDrops();
    }

    private randomTimeout(): number {
        return Math.random() * 10000;
    }

    private generateDrops(): void {
        for (let i = 0; i < this.numberOfDrops; i++) {
            setTimeout(() => {
                const x = Math.random();
                const y = Math.random();

                const dropWidth = Math.random() * 11 + 6;
                const dropHeight = dropWidth * ((Math.random() * 0.5) + 0.7);

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
                    dropHeight,
                });

                this.changeDetectorRef.detectChanges();
            }, this.randomTimeout());
        }
    }

    public getCurrentBackgroundClass(): any {
        const currentBackgroundClass = {};
        currentBackgroundClass[this.currentBackground] = true;
        return currentBackgroundClass;
    }
}
