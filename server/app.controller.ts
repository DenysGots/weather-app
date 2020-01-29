import { map, mergeMap } from 'rxjs/operators';

import { Body, Controller, Headers, Post, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('weather')
  public async getWeather(@Headers() headers: any, @Req() request: any/*, @Ip() clientIp: any*/) {
    const clientIp = request.headers['x-forwarded-for'] || '94.76.111.246';

    return this.appService.getLocation(clientIp).pipe(
      mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
      map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
    );
  }

  @Post('local')
  public async getWeatherLocally(@Body('clientIp') clientIp: any) {
    return this.appService.getLocation(clientIp).pipe(
      mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
      map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
    );
  }
}
