import { Injectable, HttpService } from '@nestjs/common';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

import { LocationDto, PositionDto } from './public-api';

@Injectable()
export class AppService {
    public weatherStateSubject: Observable<any>;

    private weatherStateSource: Subject<any>;

    private accuWeatherApikey = 'rpu3K5yQuA9IogpqOTDmX9hTEWXKnI0I';
    private apixuApikey = 'abcf9bd6ce4b40b29d7170831191703';

    private accuWeatherGetLocationUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
    private accuWeatherGetLocationKeyUrl = 'http://dataservice.accuweather.com/locations/v1/cities/';
    private accuWeatherGetFiveDaysWeatherUrl = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
    private accuWeatherGetTwelveHoursWeatherUrl = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/{locationKey}';

    private apixuGetTenDaysWeatherUrl = 'http://api.apixu.com/v1/forecast.json?';

    private geoBytesGetLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';

    constructor(private readonly httpService: HttpService) {
        this.weatherStateSource = new Subject();
        this.weatherStateSubject = this.weatherStateSource.asObservable();
    }

    public getWeather(locationDto: LocationDto) {
        let getLocationKeyUrl = this.accuWeatherGetLocationKeyUrl;
        let getFiveDaysWeatherUrl =  this.accuWeatherGetFiveDaysWeatherUrl;
        let getTwelveHoursWeatherUrl = this.accuWeatherGetTwelveHoursWeatherUrl;
        let getTenDaysWeatherUrl = this.apixuGetTenDaysWeatherUrl;
        let locationKey: any;

        getLocationKeyUrl += `${locationDto.countryCode}/search?apikey=${this.accuWeatherApikey}&q=${locationDto.city}`;

        return this.httpService
            .get(getLocationKeyUrl)
            .pipe(switchMap(locationData => {
                locationKey = locationData.data[0].Key;

                getFiveDaysWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}`;
                getTwelveHoursWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}`;
                getTenDaysWeatherUrl += `key=${this.apixuApikey}&q=${locationDto.city}&days=10`;

                const fiveDaysWeather = this.httpService
                    .get(getFiveDaysWeatherUrl)
                    .pipe(map(weatherData => weatherData.data));

                const twelveHoursWeather = this.httpService
                    .get(getTwelveHoursWeatherUrl)
                    .pipe(map(weatherData => weatherData.data));

                const tenDaysWeather = this.httpService
                    .get(getTenDaysWeatherUrl)
                    .pipe(map(weatherData => weatherData.data));

                return combineLatest(tenDaysWeather, fiveDaysWeather, twelveHoursWeather);
            }));
    }

    public getLocation(positionDto: PositionDto) {
        console.log('Server: Getting location 2');

        let getLocationUrl = this.accuWeatherGetLocationUrl;
        getLocationUrl += `?apikey=${this.accuWeatherApikey}&q=${positionDto.latitude}%${positionDto.longitude}`;

        // TODO: this works without data, by current IP? can get location from here
        this.httpService.get(getLocationUrl).subscribe(data => console.log(data));
    }
}
