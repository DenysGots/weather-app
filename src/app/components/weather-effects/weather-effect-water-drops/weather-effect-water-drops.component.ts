import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-effect-water-drops',
  templateUrl: './weather-effect-water-drops.component.html',
  styleUrls: ['./weather-effect-water-drops.component.scss']
})
export class WeatherEffectWaterDropsComponent implements OnInit {
    public drops: any[] = [];
    public borders: any[] = [];

    private pageWidth = window.innerWidth;
    private pageHeight = window.innerHeight;
    private numberOfDrops = 100;

    constructor() { }

    ngOnInit() {
        this.generateDrops();
    }

    private generateDrops(): void {
        for (let i = 0; i < this.numberOfDrops; i++) {
            const x = Math.random();
            const y = Math.random();

            const dropWidth = Math.random() * 11 + 6;
            const dropHeight = dropWidth * ((Math.random() * 0.5) + 0.7);

            const xPosition =  x * this.pageWidth;
            const yPosition =  y * this.pageHeight;

            // const backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
            const backgroundPosition = `${x * 100}% ${y * 100}%`;

            const borderWidth = dropWidth - 4;

            this.drops.push({
                xPosition,
                yPosition,
                dropWidth,
                dropHeight,
                backgroundPosition,
            });

            this.borders.push({
                xPosition,
                yPosition,
                borderWidth,
                dropHeight,
            });
        }
    }
}
