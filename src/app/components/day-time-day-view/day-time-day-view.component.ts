import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    NgZone,
    OnInit,
} from '@angular/core';

import {
    CelestialPosition,
    Parabola,
    sunSize,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-day-time-day-view',
    templateUrl: './day-time-day-view.component.html',
    styleUrls: ['./day-time-day-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeDayViewComponent implements OnInit {
    // TODO: animate background change (background-image: linear-gradient(#6af, #bdf);)

    // Sun path travel length
    @Input() dayLength: number;
    // TODO: Use this to define current sun position
    @Input() currentTime: number;
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    public sunPosition: CelestialPosition;

    // Move to public.api
    private sunContainerSize: number;
    private startX: number;
    private endX: number;
    private maxY: number;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.sunContainerSize = sunSize;
        this.startX = -1 * this.sunContainerSize/* / 1.12*/;
        this.endX = this.viewWidth + this.sunContainerSize;
        this.maxY = this.viewHeight - this.sunContainerSize;

        // TODO: uncomment
        // this.sunPosition = this.defineStartingPoint();
        this.sunPosition = {
            x: this.startX + 'px',
            y: 0 + 'px',
        };

        // this.animateSun();
        this.ngZone.runOutsideAngular(() => {
            this.animateSun();
        });
    }

    // Parabolic path is defined as 'y = a * x^ 2 + b * x + c'
    public defineAnimationPath(): Parabola {
        const viewWidth = this.viewWidth;
        const startX = this.startX;
        const endX = this.endX;
        const maxY = this.maxY;

        const b = (4 * maxY * (startX + endX)) / (-1 * Math.pow(viewWidth, 2) + 2 * viewWidth * (startX + endX) - 4 * startX * endX);
        const a = -1 * b / (startX + endX);
        const c = b * startX * (startX / (startX + endX) - 1);

        return <Parabola>{ a, b, c };
    }

    public defineStartingPoint(): CelestialPosition {
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const dayLength = 86400000; // milliseconds
        const pathLength = Math.abs(this.startX) + this.endX;
        const x = this.currentTime * pathLength / dayLength + this.startX;
        const y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

        return {
            x: x + 'px',
            y: y + 'px',
        };
    }

    public animateSun(): void {
        const currentPoint = this.sunPosition;
        const animationTime = this.dayLength;
        const animationLength = this.viewWidth + this.sunContainerSize;
        const startX = -1 * this.sunContainerSize;
        const dx = animationLength / animationTime;
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const changeDetectorRef = this.changeDetectorRef;

        let x = startX;
        let y = 0;

        function animate() {
            x += dx;
            y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

            currentPoint.x = x.toFixed(2) + 'px';
            currentPoint.y = y.toFixed(2) + 'px';

            if (x <= animationLength) {
                requestAnimationFrame(animate);
            }

            changeDetectorRef.detectChanges();
        }

        requestAnimationFrame(animate);
        changeDetectorRef.detectChanges();
    }
}
