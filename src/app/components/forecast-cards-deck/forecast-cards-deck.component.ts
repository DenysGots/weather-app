import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import {
    cardsDeckHeight,
    CardsDeckType,
    cardWidth,
    spaceMd,
} from '../../interfaces/public-api';

@Component({
    selector: 'app-forecast-cards-deck',
    templateUrl: './forecast-cards-deck.component.html',
    styleUrls: ['./forecast-cards-deck.component.scss']
})
export class ForecastCardsDeckComponent implements AfterViewInit {
    public currentMode: CardsDeckType = CardsDeckType.hours;
    public cardsDeckType = CardsDeckType;
    public numberOfCards = 24;
    public cardsDeckTopPosition = 0;
    public hoursCardsDeckLeftPosition = 0;
    public daysCardsDeckLeftPosition = 0;

    private deckWidth: number;
    private deckContainerWidth: number;

    @ViewChild('forecastCardsDeck') private forecastCardsDeck: ElementRef;
    @ViewChild('forecastCardsDeckContainer') private forecastCardsDeckContainer: ElementRef;

    constructor(private mainService: MainService) {
        // TODO: import weather state here and pass weather info to cards
    }

    ngAfterViewInit() {
        this.deckWidth = this.forecastCardsDeck.nativeElement.offsetWidth;
        this.deckContainerWidth = this.forecastCardsDeckContainer.nativeElement.offsetWidth;
    }

    public goLeft() {
        this.currentMode === CardsDeckType.hours
            ? this.hoursCardsDeckLeftPosition <= -1 * cardWidth
                ? this.hoursCardsDeckLeftPosition += cardWidth
                : this.hoursCardsDeckLeftPosition = 0
            : this.daysCardsDeckLeftPosition <= -1 * cardWidth
                ? this.daysCardsDeckLeftPosition += cardWidth
                : this.daysCardsDeckLeftPosition = 0;
    }

    public goRight() {
        this.currentMode === CardsDeckType.hours
            ? this.hoursCardsDeckLeftPosition > -1 * (this.deckContainerWidth - this.deckWidth)
                ? this.hoursCardsDeckLeftPosition -= cardWidth
                : this.hoursCardsDeckLeftPosition = -1 * (this.deckContainerWidth - this.deckWidth)
            : this.daysCardsDeckLeftPosition > -1 * (this.deckContainerWidth - this.deckWidth)
                ? this.daysCardsDeckLeftPosition -= cardWidth
                : this.daysCardsDeckLeftPosition = -1 * (this.deckContainerWidth - this.deckWidth);
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
