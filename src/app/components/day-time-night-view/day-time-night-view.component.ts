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

interface MoonPosition {
    x: string;
    y: string;
}

@Component({
    selector: 'app-day-time-night-view',
    templateUrl: './day-time-night-view.component.html',
    styleUrls: ['./day-time-night-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimeNightViewComponent implements OnInit {
    // Moon path travel length
    @Input() nightLength: number = 4000;
    @Input() viewHeight: number;
    @Input() viewWidth: number;
    @Input() withoutHeavyOvercast: boolean = true;

    public moonPosition: MoonPosition;

    private moonContainerDimension: number = 60;
    private startX: number = -1 * this.moonContainerDimension;

    constructor(private ngZone: NgZone,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.moonPosition = {
            x: this.startX + 'px',
            y: 0 + 'px',
        };

        this.animateMoon();

        this.ngZone.runOutsideAngular(() => {
            this.animateMoon();
        });
    }

    // Parabolic path is defined as "y = a * x^ 2 + b * x + c"
    public defineAnimationPath(): Parabola {
        const viewWidth = this.viewWidth;
        const startX = -1 * this.moonContainerDimension/* / 1.12*/;
        const endX = this.viewWidth/* + this.moonContainerDimension*/;
        const maxY = this.viewHeight - this.moonContainerDimension;

        const b = (4 * maxY * (startX + endX)) / (-1 * Math.pow(viewWidth, 2) + 2 * viewWidth * (startX + endX) - 4 * startX * endX);
        const a = -1 * b / (startX + endX);
        const c = b * startX * (startX / (startX + endX) - 1);

        console.log(viewWidth, startX, endX, maxY);
        return <Parabola>{ a, b, c };
    }

    public animateMoon(): void {
        const currentPoint = this.moonPosition;
        const animationTime = this.nightLength;
        const animationLength = this.viewWidth + this.moonContainerDimension;
        const startX = -1 * this.moonContainerDimension;
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
