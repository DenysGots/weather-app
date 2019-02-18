import { Component, OnInit } from '@angular/core';

import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-forecast-current-information',
  templateUrl: './forecast-current-information.component.html',
  styleUrls: ['./forecast-current-information.component.scss']
})
export class ForecastCurrentInformationComponent implements OnInit {
  constructor(private mainService: MainService) { }

  ngOnInit() { }
}
