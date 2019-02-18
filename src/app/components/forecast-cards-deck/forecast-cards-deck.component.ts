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
  constructor(private mainService: MainService) { }

  ngOnInit() { }
}
