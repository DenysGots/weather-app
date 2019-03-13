import { Injectable, HttpService } from '@nestjs/common';

export interface LocationDto {
    longitude: number;
    latitude: number;
}

@Injectable()
export class AppService {
    private accuWeatherApikey = 'rpu3K5yQuA9IogpqOTDmX9hTEWXKnI0I';
    private accuWeatherGetLocationUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search';

    private geoBytesGetLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';

    constructor(private readonly httpService: HttpService) { }

    public getLocation(locationDto: LocationDto) {
        // this.httpService.get(this.geoBytesGetLocationUrl).subscribe(data => console.log(data));

        let getLocationUrl = this.accuWeatherGetLocationUrl;
        getLocationUrl += `?apikey=${this.accuWeatherApikey}&q=${locationDto.latitude}%${locationDto.longitude}`;
        this.httpService.get(getLocationUrl).subscribe(data => console.log(data));
    }

    public getWeather(cityDto: any): any {
        // TODO: implement request to weather aggregators

        // const getAccuWeatherForecast = 'http://gd.geobytes.com/GetCityDetails?callback=?';
        // this.httpService.get(getAccuWeatherForecast).subscribe(data => console.log(data));
    }
}
