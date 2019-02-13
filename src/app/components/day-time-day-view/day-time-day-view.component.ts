import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    NgZone,
    OnInit,
} from '@angular/core';

interface Parabola {
    a: number;
    b: number;
    c: number;
}

interface SunPosition {
    x: string;
    y: string;
}

@Component({
    selector: 'app-day-time-day-view',
    templateUrl: './day-time-day-view.component.html',
    styleUrls: ['./day-time-day-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeDayViewComponent implements OnInit {
    // TODO: animate background change (background-image: linear-gradient(#6af, #bdf);)

    // Sun path travel length
    @Input() dayLength: number = 5000;
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    public sunPosition: SunPosition;

    private sunContainerDimension: number = 60;
    private startX: number = -1 * this.sunContainerDimension;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.sunPosition = {
            x: this.startX + 'px',
            y: 0 + 'px',
        };

        this.animateSun();

        this.ngZone.runOutsideAngular(() => {
            this.animateSun();
        });
    }

    // Parabolic path is defined as "y = a * x^ 2 + b * x + c"
    public defineAnimationPath(): Parabola {
        const viewWidth = this.viewWidth;
        const startX = -1 * this.sunContainerDimension/* / 1.12*/;
        const endX = this.viewWidth + this.sunContainerDimension;
        const maxY = this.viewHeight - this.sunContainerDimension;

        const b = (4 * maxY * (startX + endX)) / (-1 * Math.pow(viewWidth, 2) + 2 * viewWidth * (startX + endX) - 4 * startX * endX);
        const a = -1 * b / (startX + endX);
        const c = b * startX * (startX / (startX + endX) - 1);

        return <Parabola>{ a, b, c };
    }

    public animateSun(): void {
        const currentPoint = this.sunPosition;
        const animationTime = this.dayLength;
        const animationLength = this.viewWidth + this.sunContainerDimension;
        const startX = -1 * this.sunContainerDimension;
        const dx = animationLength / animationTime;
        const parabolaParameters: Parabola = this.defineAnimationPath();
        const changeDetectorRef = this.changeDetectorRef;

        let x = startX;
        let y = 0;

        function animate() {
            x += dx;
            y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

            currentPoint.x = x + 'px';
            currentPoint.y = y + 'px';

            changeDetectorRef.detectChanges();

            if (x <= animationLength) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
}
