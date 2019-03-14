import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

export interface LocationDto {
    longitude: number;
    latitude: number;
}

import { AppService } from './app.service';

// @Controller('home')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
        console.log('Server: connected');
    }

    @Post('weather')
    public async getWeather(@Body() cityDto: any) {
        console.log('Server: Getting weather 1', cityDto);
        this.appService.getWeather(cityDto);
    }

    @Post('location')
    public async getLocation(@Body() locationDto: LocationDto) {
        console.log('Server: Getting location 1', locationDto);
        this.appService.getLocation(locationDto);
    }

    // getLocation(): any {
    //     console.log('Server: Get weather');
    //
    //     // const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
    //     // this.httpService.get(getLocationUrl).subscribe(data => console.log(data));
    //
    //     return 'Getting weather...';
    // }
}
