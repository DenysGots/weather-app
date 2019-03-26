import {
    AfterViewInit,
    Component,
    ElementRef,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import {
    cardsDeckHeight,
    CardsDeckType,
    cardWidth,
    spaceMd,
    spaceSm,
    State,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-forecast-cards-deck',
    templateUrl: './forecast-cards-deck.component.html',
    styleUrls: ['./forecast-cards-deck.component.scss'],
})
export class ForecastCardsDeckComponent implements AfterViewInit {
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

    @ViewChild('forecastCardsDeck') private forecastCardsDeck: ElementRef;

    @ViewChildren('forecastCardsDeckContainers') private forecastCardsDeckContainers: QueryList<ElementRef>;

    constructor(private mainService: MainService) {
        this.mainService.currentStateSubject.subscribe((state: State) => {
            this.currentState = state;
            this.setNumbersOfCards();
            this.setContainersWidth();
        });
    }

    ngAfterViewInit() {
        this.deckWidth = this.forecastCardsDeck.nativeElement.offsetWidth;
    }

    public setNumbersOfCards(): void {
        if (this.currentState && this.currentState.hoursForecast) {
            this.numberOfHoursCards = this.currentState.hoursForecast.length;
        }

        if (this.currentState && this.currentState.daysForecast) {
            this.numberOfDaysCards = this.currentState.daysForecast.length;
        }
    }

    public setContainersWidth(): void {
        this.deckHoursContainerWidth = this.numberOfHoursCards * cardWidth + (this.numberOfHoursCards - 1) * spaceSm * 2;
        this.deckDaysContainerWidth = this.numberOfDaysCards * cardWidth + (this.numberOfDaysCards - 1) * spaceSm * 2;
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
