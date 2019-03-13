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

@Controller('home')
export class AppController {
    constructor(private readonly appService: AppService) {
        console.log('Server: connected');
    }

    @Post('location')
    public async getLocation(@Body() locationDto: LocationDto) {
        console.log(locationDto);
        this.appService.getLocation(locationDto);
    }

    @Post('weather')
    public async getWeather(@Body() cityDto: any) {
        this.appService.getWeather(cityDto);
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
