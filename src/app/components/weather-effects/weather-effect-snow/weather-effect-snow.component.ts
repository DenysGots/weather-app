import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnInit,
    ViewChild,
} from '@angular/core';

import { NumberOfSnowFlakes, Overcast } from '../../../interfaces/public-api';

@Component({
    selector: 'app-weather-effect-snow',
    templateUrl: './weather-effect-snow.component.html',
    styleUrls: ['./weather-effect-snow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectSnowComponent implements OnInit {
    @Input() viewHeight: number;
    @Input() viewWidth: number;
    @Input() overcast: Overcast = Overcast.light;

    @ViewChild('snowCanvas') snowCanvasRef: ElementRef;

    public snowCanvas;

    // private viewWidth = window.innerWidth;
    // private viewHeight = window.innerHeight;
    private numberOfDrops: NumberOfSnowFlakes/* = 500*/;

    constructor(private ngZone: NgZone,
                /*private changeDetectorRef: ChangeDetectorRef*/) { }

    ngOnInit() {
        // this.changeDetectorRef.detach();
        this.snowCanvas = this.snowCanvasRef.nativeElement;
        this.numberOfDrops = NumberOfSnowFlakes[this.overcast];

        this.ngZone.runOutsideAngular(() => {
            this.makeItSnow();
        });
    }

    // Taken from https://codepen.io/tmrDevelops/pen/PPgjwz by Tiffany Rayside
    private makeItSnow(): void {
        const context = this.snowCanvas.getContext('2d');
        const numberOfDrops = this.numberOfDrops;
        const canvasWidth = this.viewWidth;
        const canvasHeight = this.viewHeight;
        const drops = [];
        const scale = 1.3;
        const mv = 20;

        function Flake() {
            this.draw = function() {
                this.gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                this.gradient.addColorStop(0, 'hsla(255, 255%, 255%, 1.0)');
                this.gradient.addColorStop(0.5, 'hsla(255, 255%, 255%, 0.7)');
                this.gradient.addColorStop(1, 'hsla(255, 255%, 255%, 0)');

                context.moveTo(this.x, this.y);
                context.fillStyle = this.gradient;
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
                context.fill();
            };
        }

        function go() {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0, length = drops.length; i < length; i += 1) {
                const flake = drops[i];

                flake.y += flake.dy;
                flake.x += flake.dx;

                if (flake.y > canvasHeight + mv) {
                    flake.y = Math.round(-10 - Math.random() * mv);
                }

                if (flake.x > canvasWidth + mv) {
                    flake.x = - mv;
                } else if (flake.x < - mv) {
                    flake.x = canvasWidth + mv;
                }

                flake.draw();
            }

            requestAnimationFrame(go);
        }

        this.snowCanvas.width = canvasWidth;
        this.snowCanvas.height = canvasHeight;

        for (let i = 1; i <= numberOfDrops; i += 1) {
            const flake = new Flake();
            flake.size = (100 / (10 + (Math.random() * 100))) * scale;
            flake.y = Math.random() * (canvasHeight + 50);
            flake.x = Math.random() * canvasWidth;
            flake.t = Math.random() * (Math.PI * 2) + 0.05;
            flake.t = (flake.t >= Math.PI * 2) ? 0 : flake.t;
            flake.dx = Math.sin(flake.t) * (flake.size * 0.3);
            flake.dy = Math.pow(flake.size * 0.8, 2) * 0.15;
            flake.dy = (flake.dy < 1) ? 1 : flake.dy;
            drops.push(flake);
        }

        requestAnimationFrame(go);
    }
}
