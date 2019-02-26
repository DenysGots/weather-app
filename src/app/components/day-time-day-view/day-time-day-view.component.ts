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
    @Input() dayLength: number;
    @Input() nightLength: number;
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

        this.defineStartingPoint();
        // this.sunPosition = {
        //     x: this.startX + 'px',
        //     y: 0 + 'px',
        // };

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

        const b = (4 * maxY * (startX + endX)) /
                  (-1 * Math.pow((viewWidth + startX), 2) +
                  2 * (viewWidth + startX) * (startX + endX) - 4 * startX * endX);
        const a = -1 * b / (startX + endX);
        const c = b * startX * (startX / (startX + endX) - 1);

        // TODO: try using transform translate instead of bottom/left, here and in day theme
        // https://medium.com/outsystems-experts/flip-your-60-fps-animations-flip-em-good-372281598865
        return <Parabola>{ a, b, c };
    }

    // TODO: test
    public defineStartingPoint(): void {
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const viewPathLength = this.viewWidth;
        const dx = Math.abs(this.currentTime - this.nightLength / 2);

        let x = dx * viewPathLength / this.dayLength + this.startX;
        let y;

        if (x < this.startX) {
            x *= -1;
        }

        y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

        this.sunPosition = {
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

            currentPoint.x = x.toFixed(4) + 'px';
            currentPoint.y = y.toFixed(4) + 'px';

            if (x <= animationLength) {
                requestAnimationFrame(animate);
            }

            changeDetectorRef.detectChanges();
        }

        requestAnimationFrame(animate);
        changeDetectorRef.detectChanges();
    }
}
