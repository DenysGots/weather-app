import { map, mergeMap } from 'rxjs/operators';

import { Controller, Ip, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { DevelopmentConfigurations, LocationDto } from '../shared/public-api';
import { Config } from '../src/config/app.config';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private config: Config
  ) {}

  @Post('weather')
  public async getWeather(@Ip() clientIp: any) {
    // TODO: test
    console.log(
      'DevelopmentConfigurations: ',
      this.config.config,
      DevelopmentConfigurations[this.config.config]
    );

    return this.appService.getLocation(
      DevelopmentConfigurations[this.config.config]
        ? this.config.mockedIp
        : clientIp
      ).pipe(
        mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
        map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
      );
  }
}
