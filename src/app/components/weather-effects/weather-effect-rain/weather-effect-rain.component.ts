import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { HelpersService } from '../../../services/helpers.service';
import {
  NumberOfRainDrops,
  NumberOfRainThroughDrops,
  Overcast,
  TimeOfDay
} from '../../../../../shared/public-api';

@Component({
  selector: 'app-weather-effect-rain',
  templateUrl: './weather-effect-rain.component.html',
  styleUrls: ['./weather-effect-rain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherEffectRainComponent implements OnInit, OnChanges, OnDestroy {
  @Input() viewHeight: number;
  @Input() viewWidth: number;
  @Input() overcast: Overcast;
  @Input() timeOfDay: TimeOfDay;

  @ViewChild('rainCanvas', { static: true }) rainCanvasRef: ElementRef;
  @ViewChild('rainThroughCanvas', { static: true }) rainThroughCanvasRef: ElementRef;

  public rainCanvas;
  public rainThroughCanvas;

  private numberOfDrops: NumberOfRainDrops;
  private numberOfThroughDrops: NumberOfRainThroughDrops;
  private animation: any;
  private customWindowAnimationFrame: any;

  constructor(
    private ngZone: NgZone,
    private helpersService: HelpersService
  ) {}

  ngOnInit() {
    this.rainCanvas = this.rainCanvasRef.nativeElement;
    this.rainThroughCanvas = this.rainThroughCanvasRef.nativeElement;
    this.startAnimation();
  }

  ngOnChanges(changes: SimpleChanges) {
    const shouldCancelAnimation =
      ('overcast' in changes && !changes.overcast.firstChange) ||
      ('timeOfDay' in changes && !changes.timeOfDay.firstChange);

    if (shouldCancelAnimation) {
      this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
      this.startAnimation();
    }
  }

  public startAnimation(): void {
    this.customWindowAnimationFrame = this.helpersService.setRequestAnimationFrame();
    this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
    this.numberOfDrops = NumberOfRainDrops[this.overcast];
    this.numberOfThroughDrops = NumberOfRainThroughDrops[this.overcast];

    this.ngZone.runOutsideAngular(() => {
      this.makeItRain();
    });
  }

  // Modified version of https://codepen.io/tmrDevelops/pen/PPgjwz by Tiffany Rayside
  private makeItRain(): void {
    const rainContext = this.rainCanvas.getContext('2d');
    const rainThroughContext = this.rainThroughCanvas.getContext('2d');
    const numberOfDrops = this.numberOfDrops;
    const numberOfThroughDrops = this.numberOfThroughDrops;
    const canvasWidth = this.viewWidth;
    const canvasHeight = this.viewHeight;
    const customWindowAnimationFrame = this.customWindowAnimationFrame;
    const timeOfDay = this.timeOfDay;
    const drops = [];
    const throughDrops = [];
    const mv = 20;

    let animation = this.animation;

    function Drop() {
      this.draw = function() {
        this.gradient = rainContext.createLinearGradient(1.5 * this.x, this.y, 1.5 * this.x, this.y + this.height);

        if (timeOfDay === TimeOfDay.day) {
          this.gradient.addColorStop(0, '#a1c6cc');
          this.gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
          this.gradient.addColorStop(1, '#000');
        } else if (timeOfDay === TimeOfDay.night) {
          this.gradient.addColorStop(0, '#0d343a');
          this.gradient.addColorStop(0.5, '#aec2e0');
          this.gradient.addColorStop(1, '#fff');
        }

        rainContext.beginPath();
        rainContext.moveTo(this.x, this.y);
        rainContext.fillStyle = this.gradient;
        rainContext.fillRect(this.x, this.y, this.width, this.height);
        rainContext.closePath();
        rainContext.fill();
      };
    }

    function ThroughDrop() {
      this.draw = function() {
        this.gradient = rainThroughContext.createLinearGradient(0, this.y, 0, this.y + this.length);

        if (timeOfDay === TimeOfDay.day) {
          this.gradient.addColorStop(0, `rgba(0, 0, 0, ${this.opacity})`);
          this.gradient.addColorStop(1, '#000');
        } else if (timeOfDay === TimeOfDay.night) {
          this.gradient.addColorStop(0, `rgba(13, 52, 58, ${this.opacity})`);
          this.gradient.addColorStop(0.5, '#aec2e0');
          this.gradient.addColorStop(1, '#fff');
        }

        rainThroughContext.beginPath();
        rainThroughContext.fillStyle = this.gradient;
        rainThroughContext.fillRect(this.x, this.y, 1, this.length);
        rainThroughContext.fill();
      };
    }

    function random(min, max) {
      return Math.random() * (max - min + 1) + min;
    }

    function go() {
      rainContext.clearRect(0, 0, canvasWidth, canvasHeight);
      rainThroughContext.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0, length = drops.length; i < length; i += 1) {
        const drop = drops[i];

        drop.y += drop.speed;
        drop.x += drop.wind;

        if (drop.x > canvasWidth + mv) {
          drop.x = Math.round(-10 - Math.random() * mv);
        } else if (drop.x < 0 - mv) {
          drop.x = Math.round(canvasWidth + 10 + Math.random() * mv);
        }

        if (drop.y > canvasHeight + mv) {
          drop.y = Math.round(-10 - Math.random() * mv);
        }

        drop.draw();
      }

      for (let i = 0, length = throughDrops.length; i < length; i += 1) {
        const throughDrop = throughDrops[i];

        if (throughDrop.y >= canvasHeight) {
          throughDrop.y = canvasHeight - throughDrop.y - throughDrop.length * 5;
        } else {
          throughDrop.y += 25;
        }

        throughDrop.draw();
      }

      animation = customWindowAnimationFrame.customRequestAnimationFrame(go);
    }

    this.rainCanvas.width = canvasWidth;
    this.rainCanvas.height = canvasHeight;
    this.rainThroughCanvas.width = canvasWidth;
    this.rainThroughCanvas.height = canvasHeight;

    for (let i = 1; i <= numberOfDrops; i += 1) {
      const drop = new Drop();
      drop.speed = Math.random() * (25 - 5) + 5;
      drop.height = Math.random() * (drop.speed * 1.5 - 3) + 2;
      drop.width = Math.abs(Math.random() * (drop.speed / 14 - 2) + 1);
      drop.wind = Math.abs(Math.random() * drop.width - 1);
      drop.y = Math.random() * (canvasHeight + 50);
      drop.x = Math.random() * canvasWidth;
      drops.push(drop);
    }

    for (let i = 0; i < numberOfThroughDrops; i += 1) {
      const throughDrop = new ThroughDrop();
      throughDrop.x = random(0, canvasWidth);
      throughDrop.y = random(0, canvasHeight);
      throughDrop.length = Math.floor(random(1, 830));
      throughDrop.opacity = Math.random() * 0.2;
      throughDrops.push(throughDrop);
    }

    animation = customWindowAnimationFrame.customRequestAnimationFrame(go);
  }

  ngOnDestroy() {
    this.animation && this.customWindowAnimationFrame.customCancelAnimationFrame(this.animation);
  }
}
