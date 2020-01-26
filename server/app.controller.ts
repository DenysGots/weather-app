import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Controller, Ip, Post, Headers, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('weather')
  public async getWeather(@Headers() headers: any, @Req() request: any, @Ip() clientIp: any) {
    // TODO: test, fix, delete
    console.log('Request: ', request);
    console.log('Headers from request: ', headers);

    console.log('req.headers[x-forwarded-for]: ', req.headers && req.headers['x-forwarded-for']);
    console.log('req.connection.remoteAddress: ', req.connection && req.connection.remoteAddress);
    console.log('req.socket.remoteAddress: ', req.socket && req.socket.remoteAddress);
    console.log('req.connection.socket.remoteAddress: ', req.connection && req.connection.socket && req.connection.socket.remoteAddress);

    // console.log('Ip from request: ', clientIp);
    // this.appService.clearIpAddress(clientIp);
    return of({});

    // return this.appService.getLocation(clientIp)
    //   .pipe(
    //     mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
    //     map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
    //   );
  }

  // @Post('weather')
  // public async getWeather(@Ip() clientIp: any) {
  //   // TODO: test, delete
  //   const mockedIp = '185.112.173.116';
  //
  //   return this.appService.getLocation(mockedIp)
  //     .pipe(
  //       mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
  //       map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
  //     );
  // }
}
