import {
    Component,
    OnInit,
} from '@angular/core';

import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-forecast-cards-deck',
    templateUrl: './forecast-cards-deck.component.html',
    styleUrls: ['./forecast-cards-deck.component.scss']
})
export class ForecastCardsDeckComponent implements OnInit {
    public numberOfCards = 24;
    public numberOfVisibleCards = 7;

    constructor(private mainService: MainService) {
        // TODO: import weather state here and pass weather info to cards
    }

    ngOnInit() { }

    // TODO: add methods for controls panel: change hour/day deck, slide right/left, go home (current hour)
    // positioning can be changed by flex on outer container and just align-content: flex-start / end
}
