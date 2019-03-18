import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import { AppService } from './app.service';
import { LocationDto, PositionDto } from './public-api';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('weather')
    public async getWeather(@Body() locationDto: LocationDto) {
        return this.appService.getWeather(locationDto);
    }

    @Post('location')
    public async getLocation(@Body() positionDto: PositionDto) {
        this.appService.getLocation(positionDto);
    }
}
