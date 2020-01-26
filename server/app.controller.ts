import { map, mergeMap } from 'rxjs/operators';

import { Controller, Ip, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('weather')
  public async getWeather(@Ip() clientIp: any) {
    return this.appService.getLocation(clientIp)
      .pipe(
        mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
        map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
      );
  }
}
