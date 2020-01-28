import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Controller, Ip, Post, Headers, Req, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('weather')
  public async getWeather(@Headers() headers: any, @Req() request: any/*, @Ip() clientIp: any*/) {
    // TODO: test, fix, delete
    // console.log('Request: ', request);
    // console.log('Headers from request: ', headers);

    // This one works => 94.76.111.246
    console.log('req.headers[x-forwarded-for]: ', request.headers && request.headers['x-forwarded-for']);
    // TODO: check this one
    console.log('headers[x-forwarded-for]: ', headers && headers['x-forwarded-for']);

    // This three doesn't => 10.11.72.189
    // console.log('req.connection.remoteAddress: ', request.connection && request.connection.remoteAddress);
    // console.log('req.socket.remoteAddress: ', request.socket && request.socket.remoteAddress);
    // console.log('req.connection.socket.remoteAddress: ', request.connection && request.connection.socket && request.connection.socket.remoteAddress);

    // console.log('Ip from request: ', clientIp);
    // this.appService.clearIpAddress(clientIp);
    // return of({});

    // IP value falls back to mocked one in case of serving app locally
    const clientIp = request.headers['x-forwarded-for'] || '94.76.111.246';
    console.log('clientIp: ', clientIp);

    return this.appService.getLocation(clientIp).pipe(
      mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
      map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
    );
  }

  @Post('weather-locally')
  public async getWeatherLocally(@Body clientIp: any) {
    console.log('body: ', clientIp);

    return this.appService.getLocation(clientIp).pipe(
      mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
      map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
    );
  }

}
