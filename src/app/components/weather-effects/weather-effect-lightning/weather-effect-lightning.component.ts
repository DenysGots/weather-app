import _isNil from 'lodash/isNil';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-weather-effect-lightning',
  templateUrl: './weather-effect-lightning.component.html',
  styleUrls: ['./weather-effect-lightning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherEffectLightningComponent implements OnInit, OnDestroy {
  @Input() viewHeight: number;
  @Input() viewWidth: number;

  @ViewChild('lightning', { static: false }) lightningRef: ElementRef;

  public lightningElement;

  private animation: any;
  private customWindowAnimationFrame: any;

  constructor(
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private helpersService: HelpersService
  ) {}

  ngOnInit() {
    this.changeDetectorRef.detach();
    this.lightningElement = this.lightningRef.nativeElement;
    this.customWindowAnimationFrame = this.helpersService.setRequestAnimationFrame();

    this.ngZone.runOutsideAngular(() => {
      this.makeItLight();
    });
  }

  // Taken from https://codepen.io/Nvagelis/pen/yaQGAL by Nvagelis
  private makeItLight(): void {
    const lightningContext = this.lightningElement.getContext('2d');
    const canvasWidth = this.viewWidth;
    const canvasHeight = this.viewHeight;
    const lightning = [];
    const customWindowAnimationFrame = this.customWindowAnimationFrame;

    let lightTimeCurrent = 0;
    let lightTimeTotal = 0;
    let animation = this.animation;

    this.lightningElement.width = canvasWidth;
    this.lightningElement.height = canvasHeight;

    function random(min, max) {
      return Math.random() * (max - min + 1) + min;
    }

    function clearCanvas() {
      lightningContext.globalCompositeOperation = 'destination-out';
      lightningContext.fillStyle = `rgba(0, 0, 0, ${random(1, 30) / 100})`;
      lightningContext.fillRect(0, 0, canvasWidth, canvasHeight);
      lightningContext.globalCompositeOperation = 'source-over';
    }

    function createLightning() {
      const x = random(100, canvasWidth - 100);
      const y = random(0, canvasHeight / 4);
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

    function drawLightning() {
      for (let i = 0, length = lightning.length; i < length; i += 1) {
        const light = lightning[i];

        if (!_isNil(light)) {
          light.path.push({
            x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
            y: light.path[light.path.length - 1].y + (random(0, light.yRange))
          });

          (light.path.length > light.pathLimit) && lightning.splice(i, 1);

          lightningContext.lineWidth = 1;
          lightningContext.globalCompositeOperation = 'lighter';
          lightningContext.shadowBlur = 30;
          lightningContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
          lightningContext.strokeStyle = 'rgba(255, 255, 255, 0.1)';

          (random(0, 15) === 0) && (lightningContext.lineWidth = 6);
          (random(0, 30) === 0) && (lightningContext.lineWidth = 8);

          lightningContext.beginPath();
          lightningContext.moveTo(light.x, light.y);

          for (let point = 0, pathLength = light.path.length; point < pathLength; point += 1) {
            lightningContext.lineTo(light.path[point].x, light.path[point].y);
          }

          if (Math.floor(random(0, 30)) === 1) {
            lightningContext.fillStyle = `rgba(255, 255, 255, ${random(1, 3) / 100})`;
            lightningContext.fillRect(0, 0, canvasWidth, canvasHeight);
          }

          lightningContext.lineJoin = 'miter';
          lightningContext.stroke();
          lightningContext.restore();
        }
      }
    }

    function animateLightning() {
      clearCanvas();

      lightTimeCurrent += 1;

      if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = 200;
      }

      drawLightning();
    }

    function loop() {
      animateLightning();
      animation = customWindowAnimationFrame.customRequestAnimationFrame(loop);
    }

    animation = customWindowAnimationFrame.customRequestAnimationFrame(loop);
  }

  ngOnDestroy() {
    this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
  }
}
