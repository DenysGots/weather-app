import {
    Component,
    OnInit,
} from '@angular/core';

import { MainService } from '../../services/main.service';
import { CardsDeckType } from '../../interfaces/public-api';

@Component({
    selector: 'app-forecast-cards-deck',
    templateUrl: './forecast-cards-deck.component.html',
    styleUrls: ['./forecast-cards-deck.component.scss']
})
export class ForecastCardsDeckComponent implements OnInit {
    public numberOfCards = 24;
    public numberOfVisibleCards = 7;

    public currentMode: CardsDeckType = CardsDeckType.hours;

    constructor(private mainService: MainService) {
        // TODO: import weather state here and pass weather info to cards
    }

    ngOnInit() { }

    // TODO: add methods for controls panel: change hour/day deck, slide right/left, go home (current hour)
    // positioning can be changed by flex on outer container and just align-content: flex-start / end

    public getCurrentMode(mode: string) {
        return this.currentMode === mode;
    }
}
