import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { map } from 'rxjs/operators/map';

import { AppService } from './app.service';
import { LocationDto, PositionDto } from '../shared/public-api';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('weather')
    public async getWeather(@Body() locationDto: LocationDto) {
        // return this.appService.getWeather(locationDto);
        return this.appService
            .getWeather(locationDto)
            .pipe(
                map(weatherData => this.appService.adjustReceivedData(weatherData))
            );
    }

    @Post('location')
    public async getLocation(@Body() positionDto: PositionDto) {
        this.appService.getLocation(positionDto);
    }
}
