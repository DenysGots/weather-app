import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-water-drops',
    templateUrl: './weather-effect-water-drops.component.html',
    styleUrls: ['./weather-effect-water-drops.component.scss']
})
export class WeatherEffectWaterDropsComponent implements OnInit {
    // TODO: import all possible backgrounds here and use them for drops background accordingly with main view

    @Input() viewHeight: number;
    @Input() viewWidth: number;

    public drops: any[] = [];
    public borders: any[] = [];

    private numberOfDrops = 100;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
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
}
