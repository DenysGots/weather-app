import { takeWhile } from 'rxjs/operators';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { MainService } from '../../services/main.service';
import {
  cardsDeckHeight,
  CardsDeckType,
  cardWidth,
  spaceMd,
  spaceSm,
  State
} from '../../../../shared/public-api';

@Component({
  selector: 'app-forecast-cards-deck',
  templateUrl: './forecast-cards-deck.component.html',
  styleUrls: ['./forecast-cards-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastCardsDeckComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentState: State;
  public currentMode: CardsDeckType = CardsDeckType.hours;
  public cardsDeckType = CardsDeckType;

  public numberOfHoursCards: number;
  public numberOfDaysCards: number;

  public cardsDeckTopPosition = 0;
  public hoursCardsDeckLeftPosition = 0;
  public daysCardsDeckLeftPosition = 0;

  private deckWidth: number;
  private deckHoursContainerWidth: number;
  private deckDaysContainerWidth: number;
  private isAlive = true;

  @ViewChild('forecastCardsDeck', { static: false })
  private forecastCardsDeck: ElementRef;
  @ViewChild('forecastCardsDeckHoursContainer', { static: false })
  private forecastCardsDeckHoursContainer: ElementRef;
  @ViewChild('forecastCardsDeckDaysContainer', { static: false })
  private forecastCardsDeckDaysContainer: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService
  ) {}

  ngOnInit() {
    this.mainService.currentStateSubject
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((state: State) => {
        this.currentState = state;
        this.changeDetectorRef.detectChanges();
        this.setNumbersOfCards();
        this.setContainersWidth();
      });
  }

  ngAfterViewInit() {
    this.deckWidth = this.forecastCardsDeck.nativeElement.offsetWidth;
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  public setNumbersOfCards(): void {
    (this.currentState && this.currentState.hoursForecast) &&
      (this.numberOfHoursCards = this.currentState.hoursForecast.length);

    (this.currentState && this.currentState.daysForecast) &&
      (this.numberOfDaysCards = this.currentState.daysForecast.length);
  }

  public setContainersWidth(): void {
    this.forecastCardsDeckHoursContainer &&
      (this.deckHoursContainerWidth = this.forecastCardsDeckHoursContainer.nativeElement.offsetWidth);

    this.forecastCardsDeckDaysContainer &&
      (this.deckDaysContainerWidth = this.forecastCardsDeckDaysContainer.nativeElement.offsetWidth);
  }

  public goLeft() {
    this.currentMode === CardsDeckType.hours
      ? this.hoursCardsDeckLeftPosition <= -1 * cardWidth
        ? this.hoursCardsDeckLeftPosition += (cardWidth + spaceSm * 2)
        : this.hoursCardsDeckLeftPosition = 0
      : this.daysCardsDeckLeftPosition <= -1 * cardWidth
        ? this.daysCardsDeckLeftPosition += (cardWidth + spaceSm * 2)
        : this.daysCardsDeckLeftPosition = 0;
  }

  public goRight() {
    this.currentMode === CardsDeckType.hours
      ? this.hoursCardsDeckLeftPosition > -1 * (this.deckHoursContainerWidth - this.deckWidth - cardWidth)
        ? this.hoursCardsDeckLeftPosition -= this.deckHoursContainerWidth / this.numberOfHoursCards
        : this.hoursCardsDeckLeftPosition = -1 * (this.deckHoursContainerWidth - this.deckWidth)
      : this.daysCardsDeckLeftPosition > -1 * (this.deckDaysContainerWidth - this.deckWidth - cardWidth)
        ? this.daysCardsDeckLeftPosition -= this.deckDaysContainerWidth / this.numberOfDaysCards
        : this.daysCardsDeckLeftPosition = -1 * (this.deckDaysContainerWidth - this.deckWidth);
  }

  public goToHoursView() {
    this.currentMode = CardsDeckType.hours;
    this.cardsDeckTopPosition = 0;
  }

  public goToDaysView() {
    this.currentMode = CardsDeckType.days;
    this.cardsDeckTopPosition = -1 * (cardsDeckHeight + spaceMd);
  }

  public resetCardsView() {
    this.currentMode = CardsDeckType.hours;
    this.cardsDeckTopPosition = 0;
    this.hoursCardsDeckLeftPosition = 0;
    this.daysCardsDeckLeftPosition = 0;
  }
}
