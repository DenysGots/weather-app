import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewRef,
} from '@angular/core';

import { HelpersService } from '../../services/helpers.service';

import {
    CelestialPosition,
    Parabola,
    sunSize,
} from '../../../../shared/public-api';

@Component({
    selector: 'app-day-time-day-view',
    templateUrl: './day-time-day-view.component.html',
    styleUrls: ['./day-time-day-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeDayViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() dayLength: number;
    @Input() nightLength: number;
    @Input() currentTime: number;
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    public sunPosition: CelestialPosition;

    private sunContainerSize: number;
    private startX: number;
    private endX: number;
    private maxY: number;
    private animation: any;
    private customWindowAnimationFrame: any;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef,
                private helpersService: HelpersService) { }

    ngOnInit() {
        this.sunContainerSize = sunSize;
        this.startX = -1 * this.sunContainerSize/* / 1.12*/;
        this.endX = this.viewWidth + this.sunContainerSize;
        this.maxY = this.viewHeight - this.sunContainerSize;

        this.startAnimation();

        // this.defineStartingPoint();
        // // this.sunPosition = {
        // //     x: this.startX + 'px',
        // //     y: 0 + 'px',
        // // };

        // // this.animateSun();
        // this.ngZone.runOutsideAngular(() => {
        //     this.animateSun();
        // });
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('currentTime' in changes && !changes.currentTime.firstChange) {
            this.startAnimation();
        }
    }

    public startAnimation(): void {
        // this.sunPosition = {
        //     x: this.startX + 'px',
        //     y: 0 + 'px',
        // };

        this.customWindowAnimationFrame = this.helpersService.setRequestAnimationFrame();

        if (this.animation) {
            this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
        }

        this.defineStartingPoint();

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

        // TODO: try implementing transform translate instead of bottom/left, here and in night theme
        // https://medium.com/outsystems-experts/flip-your-60-fps-animations-flip-em-good-372281598865
        return <Parabola>{ a, b, c };
    }

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
            x: x.toFixed(4),
            y: y.toFixed(4),
        };
    }

    public animateSun(): void {
        const currentPoint = this.sunPosition;
        const animationTime = this.dayLength;
        const animationLength = this.viewWidth + this.sunContainerSize;
        const dx = animationLength / animationTime;
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const changeDetectorRef = this.changeDetectorRef;
        const customWindowAnimationFrame = this.customWindowAnimationFrame;

        let animation = this.animation;
        let x = parseInt(currentPoint.x, 10);
        let y = parseInt(currentPoint.y, 10);

        function detectChanges(): void {
            if (!(<ViewRef>changeDetectorRef).destroyed) {
                changeDetectorRef.detectChanges();
            }
        }

        function animate() {
            x += dx;
            y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

            currentPoint.x = x.toFixed(4);
            currentPoint.y = y.toFixed(4);

            if (x <= animationLength) {
                animation = customWindowAnimationFrame.customRequestAnimationFrame(animate);
            } else {
                customWindowAnimationFrame.customCancelAnimationFrame(animation);
            }

            detectChanges();
        }

        animation = customWindowAnimationFrame.customRequestAnimationFrame(animate);
        detectChanges();
    }

    ngOnDestroy() {
        if (this.animation) {
            this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
        }
    }
}
