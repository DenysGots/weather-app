import { Body, Controller, Post } from '@nestjs/common';
import { map } from 'rxjs/operators/map';

import { AppService } from './app.service';
import { LocationDto } from '../shared/public-api';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('weather')
    public async getWeather(@Body() locationDto: LocationDto) {
        return this.appService
            .getWeather(locationDto)
            .pipe(map(weatherData => this.appService.adjustReceivedData(weatherData)));
    }
}
