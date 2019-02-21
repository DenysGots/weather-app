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
    moonSize,
    Parabola,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-day-time-night-view',
    templateUrl: './day-time-night-view.component.html',
    styleUrls: ['./day-time-night-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeNightViewComponent implements OnInit {
    @Input() withoutHeavyOvercast: boolean; // Hides stars due to performance issues in combination with snow/rain animation
    @Input() dayLength: number;
    @Input() nightLength: number;
    @Input() currentTime: number;
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    public moonPosition: CelestialPosition;

    // Move to public.api
    private moonContainerSize: number;
    private startX: number;
    private endX: number;
    private maxY: number;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.moonContainerSize = moonSize;
        this.startX = -1 * this.moonContainerSize/* / 1.12*/;
        this.endX = this.viewWidth + this.moonContainerSize;
        this.maxY = this.viewHeight/* - this.moonContainerSize*/;

        this.defineStartingPoint();
        // this.moonPosition = {
        //     x: this.startX + 'px',
        //     y: 0 + 'px',
        // };

        // this.animateMoon();
        this.ngZone.runOutsideAngular(() => {
            this.animateMoon();
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

        // TODO: try using transform translate instead of bottom/left, here and in day theme
        // https://medium.com/outsystems-experts/flip-your-60-fps-animations-flip-em-good-372281598865
        return <Parabola>{ a, b, c };
    }

    // TODO: test
    public defineStartingPoint(): void {
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const viewPathLength = this.viewWidth;
        const dx = (this.currentTime > this.nightLength / 2)
            ? Math.abs(this.currentTime - this.dayLength - this.nightLength / 2)
            : Math.abs(this.nightLength - this.currentTime);

        let x = dx * viewPathLength / this.nightLength + this.startX;
        let y;

        if (x < this.startX) {
            x *= -1;
        }

        y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

        this.moonPosition = {
            x: x + 'px',
            y: y + 'px',
        };
    }

    public animateMoon(): void {
        const currentPoint = this.moonPosition;
        const animationTime = this.nightLength;
        const animationLength = this.viewWidth + this.moonContainerSize;
        const dx = animationLength / animationTime;
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const changeDetectorRef = this.changeDetectorRef;

        let x = parseInt(currentPoint.x, 10);
        let y = parseInt(currentPoint.y, 10);

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
