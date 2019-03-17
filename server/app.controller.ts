import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

// TODO: move to public.api
export interface PositionDto {
    longitude: number;
    latitude: number;
}

export interface LocationDto {
    countryCode: string;
    country: string;
    city: string;
}

import { AppService } from './app.service';

// @Controller('home')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
        console.log('Server: connected');
    }

    @Post('weather')
    public async getWeather(@Body() locationDto: LocationDto) {
        // this.appService.getWeather(locationDto);
        //
        // console.log(await this.appService.weatherStateSubject.subscribe(() => console.log('Observable')));
        // console.log(await this.appService.weatherStateSubject.toPromise().then(() => console.log('Promise')));
        //
        // return await this.appService.weatherStateSubject.toPromise().then(data => data);


        // this.appService.getWeather(locationDto);
        // this.appService.weatherStateSubject.subscribe(data => console.log(data));
        // return this.appService.weatherStateSubject;


        return this.appService.getWeather(locationDto);
    }

    @Post('location')
    public async getLocation(@Body() positionDto: PositionDto) {
        console.log('Server: Getting location 1', positionDto);
        this.appService.getLocation(positionDto);
    }
}
