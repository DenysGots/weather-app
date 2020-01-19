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
  ViewRef
} from '@angular/core';

import {
  CelestialData,
  CelestialPosition,
  Parabola,
  sunSize
} from '../../../../shared/public-api';
import { HelpersService } from '../../services/helpers.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-day-time-day-view',
  templateUrl: './day-time-day-view.component.html',
  styleUrls: ['./day-time-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private helpersService: HelpersService
  ) {}

  ngOnInit() {
    this.sunContainerSize = sunSize;
    this.startX = -1 * this.sunContainerSize;
    this.endX = this.viewWidth + this.sunContainerSize;
    this.maxY = this.viewHeight - this.sunContainerSize;
    this.startAnimation();
  }

  ngOnChanges(changes: SimpleChanges) {
    ('currentTime' in changes && !changes.currentTime.firstChange) && this.startAnimation();
  }

  public startAnimation(): void {
    this.customWindowAnimationFrame = this.helpersService.setRequestAnimationFrame();

    this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);

    this.defineStartingPoint();

    this.ngZone.runOutsideAngular(() => {
      this.animateSun();
    });
  }

  // Parabolic path is defined as 'y = a * x^2 + b * x + c'
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

    return <Parabola>{ a, b, c };
  }

  public defineStartingPoint(): void {
    const parabolaParameters: Parabola = this.defineAnimationPath();
    const viewPathLength = this.viewWidth;
    const dx = Math.abs(this.currentTime - this.nightLength / 2);

    let x = dx * viewPathLength / this.dayLength + this.startX;
    let y;

    (x < this.startX) && (x *= -1);

    y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

    this.sunPosition = {
      x: x.toFixed(4),
      y: y.toFixed(4)
    };

    this.mainService.setCelestialData(<CelestialData>{celestial: this.sunPosition});
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
      (!(<ViewRef>changeDetectorRef).destroyed) && changeDetectorRef.detectChanges();
    }

    function animate() {
      x += dx;
      y = parabolaParameters.a * Math.pow(x, 2) + parabolaParameters.b * x + parabolaParameters.c;

      currentPoint.x = x.toFixed(4);
      currentPoint.y = y.toFixed(4);

      (x <= animationLength)
        ? (animation = customWindowAnimationFrame.customRequestAnimationFrame(animate))
        : customWindowAnimationFrame.customCancelAnimationFrame(animation);

      detectChanges();
    }

    animation = customWindowAnimationFrame.customRequestAnimationFrame(animate);

    detectChanges();
  }

  ngOnDestroy() {
    this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
  }
}
