// import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Body, Controller, Ip, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('weather')
    public async getWeather(/*@Body() locationDto: LocationDto,*/ @Ip() clientIp: any) {
        // return this.appService
        //     .getWeather(locationDto)
        //     .pipe(map(weatherData => this.appService.adjustReceivedData(weatherData)));

        // For testing purposes
        const randIp = '185.112.173.116';

        // For testing purposes, change 'randIp' to 'clientIp'
        return this.appService.getLocation(randIp)
            .pipe(
                mergeMap((clientLocation: LocationDto) => this.appService.getWeather(clientLocation)),
                map((weatherData: any) => this.appService.adjustReceivedData(weatherData))
            );
    }

    // @Post('test')
    // public async getTestData(@Ip() clientIp: any) {
    //     console.log('clientIp: ', clientIp);
    //     return of(JSON.stringify(clientIp));
    // }
}
