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

    // public numberOfCards = 24;
    public numberOfHoursCards: number;
    public numberOfDaysCards: number;

    public cardsDeckTopPosition = 0;
    public hoursCardsDeckLeftPosition = 0;
    public daysCardsDeckLeftPosition = 0;

    private deckWidth: number;
    private deckHoursContainerWidth: number;
    private deckDaysContainerWidth: number;

    @ViewChild('forecastCardsDeck') private forecastCardsDeck: ElementRef;
    // @ViewChild('forecastCardsDeckHoursContainer') private forecastCardsDeckHoursContainer: ElementRef;
    // @ViewChild('forecastCardsDeckDaysContainer') private forecastCardsDeckDaysContainer: ElementRef;

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
        // this.deckContainerWidth = this.forecastCardsDeckContainer.nativeElement.offsetWidth;
    }

    public setNumbersOfCards(): void {
        if (this.currentState && this.currentState.hoursForecast) {
            this.numberOfHoursCards = this.currentState.hoursForecast.length;
            console.log('numberOfHoursCards: ', this.numberOfHoursCards);
        }

        if (this.currentState && this.currentState.daysForecast) {
            this.numberOfDaysCards = this.currentState.daysForecast.length;
            console.log('numberOfDaysCards: ', this.numberOfDaysCards);
        }
    }

    public setContainersWidth(): void {
        // if (this.forecastCardsDeckHoursContainer) {
        //     this.deckHoursContainerWidth = this.forecastCardsDeckHoursContainer.nativeElement.offsetWidth;
        //     console.log('deckHoursContainerWidth: ', this.deckHoursContainerWidth);
        // }
        // console.log(this.forecastCardsDeckHoursContainer);
        //
        // if (this.forecastCardsDeckDaysContainer) {
        //     this.deckDaysContainerWidth = this.forecastCardsDeckDaysContainer.nativeElement.offsetWidth;
        //     console.log('deckDaysContainerWidth: ', this.deckDaysContainerWidth);
        // }
        // console.log(this.forecastCardsDeckDaysContainer);

        // TODO: not working, needs to be fixed

        // if (this.forecastCardsDeckContainers) {
        //     console.log(this.forecastCardsDeckContainers);
        //     console.log(this.forecastCardsDeckContainers.toArray());
        //     console.log(this.forecastCardsDeckContainers.toArray()[0]);
        //     console.log(this.forecastCardsDeckContainers.toArray()[0].nativeElement);
        //     console.log(this.forecastCardsDeckContainers.toArray()[0].nativeElement.offsetWidth);
        //
        //     if (this.forecastCardsDeckContainers.toArray()[0]) {
        //         this.deckHoursContainerWidth = this.forecastCardsDeckContainers.toArray()[0].nativeElement.offsetWidth;
        //         console.log('deckHoursContainerWidth: ', this.deckHoursContainerWidth);
        //     }
        //
        //     if (this.forecastCardsDeckContainers.toArray()[1]) {
        //         this.deckDaysContainerWidth = this.forecastCardsDeckContainers.toArray()[1].nativeElement.offsetWidth;
        //         console.log('deckDaysContainerWidth: ', this.deckDaysContainerWidth);
        //     }
        // }

        this.deckHoursContainerWidth = this.numberOfHoursCards * cardWidth + (this.numberOfHoursCards - 1) * spaceSm * 2;
        this.deckDaysContainerWidth = this.numberOfDaysCards * cardWidth + (this.numberOfDaysCards - 1) * spaceSm * 2;

        console.log('deckHoursContainerWidth: ', this.deckHoursContainerWidth);
        console.log('deckDaysContainerWidth: ', this.deckDaysContainerWidth);
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
            ? this.hoursCardsDeckLeftPosition > -1 * (this.deckHoursContainerWidth - this.deckWidth)
            ? this.hoursCardsDeckLeftPosition -= (cardWidth + spaceSm * 2)
            : this.hoursCardsDeckLeftPosition = -1 * (this.deckHoursContainerWidth - this.deckWidth)
            : this.daysCardsDeckLeftPosition > -1 * (this.deckDaysContainerWidth - this.deckWidth)
            ? this.daysCardsDeckLeftPosition -= (cardWidth + spaceSm * 2)
            : this.daysCardsDeckLeftPosition = -1 * (this.deckDaysContainerWidth - this.deckWidth);
    }

    // public goLeft() {
    //     this.currentMode === CardsDeckType.hours
    //         ? this.hoursCardsDeckLeftPosition <= -1 * cardWidth
    //             ? this.hoursCardsDeckLeftPosition += cardWidth
    //             : this.hoursCardsDeckLeftPosition = 0
    //         : this.daysCardsDeckLeftPosition <= -1 * cardWidth
    //             ? this.daysCardsDeckLeftPosition += cardWidth
    //             : this.daysCardsDeckLeftPosition = 0;
    // }
    //
    // public goRight() {
    //     this.currentMode === CardsDeckType.hours
    //         ? this.hoursCardsDeckLeftPosition > -1 * (this.deckHoursContainerWidth - this.deckWidth)
    //             ? this.hoursCardsDeckLeftPosition -= cardWidth
    //             : this.hoursCardsDeckLeftPosition = -1 * (this.deckHoursContainerWidth - this.deckWidth)
    //         : this.daysCardsDeckLeftPosition > -1 * (this.deckDaysContainerWidth - this.deckWidth)
    //             ? this.daysCardsDeckLeftPosition -= cardWidth
    //             : this.daysCardsDeckLeftPosition = -1 * (this.deckDaysContainerWidth - this.deckWidth);
    // }

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

    // public isForecastDataPresent(forecast: string): boolean {
    //     return forecast in this.currentState && this.currentState[forecast].length > 0;
    // }
}
