import {
    Controller,
    Get,
    HttpService,
} from '@nestjs/common';

@Controller('home')
export class AppController {
    constructor(private readonly httpService: HttpService) {
        console.log('Server: connected');
    }

    // TODO: implement request to weather aggregators
    @Get('weather')
    getLocation(): any {
        // TODO: change to Post, use location to get and return weather
        console.log('Server: Get weather');

        // const getLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        // this.httpService.get(getLocationUrl).subscribe(data => console.log(data));

        return 'Getting weather...';
    }
}
