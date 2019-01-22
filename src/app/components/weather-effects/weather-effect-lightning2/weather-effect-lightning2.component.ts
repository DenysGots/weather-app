import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-weather-effect-lightning2',
    templateUrl: './weather-effect-lightning2.component.html',
    styleUrls: ['./weather-effect-lightning2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherEffectLightning2Component implements OnInit {
    public canvas1;
    public canvas2;
    public canvas3;

    private pageWidth = window.innerWidth;
    private pageHeight = window.innerHeight;
    private numberOfDrops = 1000;

    @ViewChild('canvas1') canvas1Ref: ElementRef;
    @ViewChild('canvas2') canvas2Ref: ElementRef;
    @ViewChild('canvas3') canvas3Ref: ElementRef;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.changeDetectorRef.detach();
        this.canvas1 = this.canvas1Ref.nativeElement;
        this.canvas2 = this.canvas2Ref.nativeElement;
        this.canvas3 = this.canvas3Ref.nativeElement;

        this.ngZone.runOutsideAngular(() => {
            this.makeItLight();
        });
    }

    // Taken from https://codepen.io/Nvagelis/pen/yaQGAL by Nvagelis
    private makeItLight(): void {
        const context1 = this.canvas1.getContext('2d');
        const context2 = this.canvas2.getContext('2d');
        const context3 = this.canvas3.getContext('2d');

        const rainthroughnum = 500;
        const speedRainTrough = 25;
        const RainTrough = [];

        const rainnum = 500;
        const rain = [];

        const lightning = [];

        let lightTimeCurrent = 0;
        let lightTimeTotal = 0;

        const canvasWidth = this.pageWidth;
        const canvasHeight = this.pageHeight;
        const w = this.pageWidth;
        const h = this.pageHeight;

        this.canvas1.width = this.canvas2.width = this.canvas3.width = canvasWidth;
        this.canvas1.height = this.canvas2.height = this.canvas3.height = canvasHeight;

        function random(min, max) {
            return Math.random() * (max - min + 1) + min;
        }

        function clearcanvas1() {
            context1.clearRect(0, 0, w, h);
        }

        function clearcanvas2() {
            context2.clearRect(0, 0, w, h);
        }

        function clearCanvas3() {
            context3.globalCompositeOperation = 'destination-out';
            context3.fillStyle = `rgba(0, 0, 0, ${random(1, 30) / 100})`;
            context3.fillRect(0, 0, w, h);
            context3.globalCompositeOperation = 'source-over';

            // context3.clearRect(0, 0, w, h);
        }

        function createRainTrough() {
            for (let i = 0; i < rainthroughnum; i += 1) {
                RainTrough[i] = {
                    x: random(0, w),
                    y: random(0, h),
                    length: Math.floor(random(1, 830)),
                    opacity: Math.random() * 0.2,
                    xs: random(-2, 2),
                    ys: random(10, 20)
                };
            }
        }

        function createRain() {
            for (let i = 0; i < rainnum; i += 1) {
                rain[i] = {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    l: Math.random() * 1,
                    xs: -4 + Math.random() * 4 + 2,
                    ys: Math.random() * 10 + 10
                };
            }
        }

        function createLightning() {
            const x = random(100, w - 100);
            const y = random(0, h / 4);
            const createCount = random(1, 3);

            for (let i = 0; i < createCount; i += 1) {
                const single = {
                    x: x,
                    y: y,
                    xRange: random(5, 50),
                    yRange: random(10, 25),
                    path: [{
                        x: x,
                        y: y
                    }],
                    pathLimit: random(40, 55)
                };

                lightning.push(single);
            }
        }

        function drawRainTrough(i) {
            context1.beginPath();
            const grd = context1.createLinearGradient(0, RainTrough[i].y, 0, RainTrough[i].y + RainTrough[i].length);
            grd.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grd.addColorStop(1, `rgba(255, 255, 255, ${RainTrough[i].opacity})`);
            context1.fillStyle = grd;
            context1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
            context1.fill();
        }

        function drawRain(i) {
            context2.beginPath();
            context2.moveTo(rain[i].x, rain[i].y);
            context2.lineTo(rain[i].x + rain[i].l * rain[i].xs, rain[i].y + rain[i].l * rain[i].ys);
            context2.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            context2.lineWidth = 1;
            context2.lineCap = 'round';
            context2.stroke();
        }

        function drawLightning() {
            for (let i = 0; i < lightning.length; i += 1) {
                const light = lightning[i];

                light.path.push({
                    x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
                    y: light.path[light.path.length - 1].y + (random(0, light.yRange))
                });

                if (light.path.length > light.pathLimit) {
                    lightning.splice(i, 1);
                }

                context3.lineWidth = 1;
                context3.globalCompositeOperation = 'lighter';
                context3.shadowBlur  = 30;
                context3.shadowColor = 'rgba(255, 255, 255, 0.5)';
                context3.strokeStyle = 'rgba(255, 255, 255, 0.1)';

                if (random(0, 15) === 0) {
                    context3.lineWidth = 6;
                }

                if (random(0, 30) === 0) {
                    context3.lineWidth = 8;
                }

                context3.beginPath();
                context3.moveTo(light.x, light.y);

                for (let pc = 0; pc < light.path.length; pc += 1) {
                    context3.lineTo(light.path[pc].x, light.path[pc].y);
                }

                if (Math.floor(random(0, 30)) === 1) {
                    context3.fillStyle = `rgba(255, 255, 255, ${random(1, 3) / 100})`;
                    context3.fillRect(0, 0, w, h);
                }

                context3.lineJoin = 'miter';
                context3.stroke();
                context3.restore();
            }
        }

        function animateRainTrough() {
            clearcanvas1();

            for (let i = 0; i < rainthroughnum; i += 1) {
                if (RainTrough[i].y >= h) {
                    RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
                } else {
                    RainTrough[i].y += speedRainTrough;
                }

                drawRainTrough(i);
            }
        }

        function animateRain() {
            clearcanvas2();

            for (let i = 0; i < rainnum; i += 1) {
                rain[i].x += rain[i].xs;
                rain[i].y += rain[i].ys;

                if (rain[i].x > w || rain[i].y > h) {
                    rain[i].x = Math.random() * w;
                    rain[i].y = -20;
                }

                drawRain(i);
            }
        }

        function animateLightning() {
            clearCanvas3();

            lightTimeCurrent += 1;

            if (lightTimeCurrent >= lightTimeTotal) {
                createLightning();
                lightTimeCurrent = 0;
                lightTimeTotal = 200;  // rand(100, 200)
            }

            drawLightning();
        }

        function init() {
            createRainTrough();
            createRain();
        }

        init();

        function loop() {
            // TODO: uncomment if needed
            // animateRainTrough();
            // animateRain();
            animateLightning();

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }
}
