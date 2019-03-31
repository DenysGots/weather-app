import { Injectable, HttpService } from '@nestjs/common';
import { combineLatest, Observable, Subject, timer, iif, throwError, of } from 'rxjs';
import { delayWhen } from 'rxjs/operators/delayWhen';
import { map } from 'rxjs/operators/map';
import { retryWhen } from 'rxjs/operators/retryWhen';
import { switchMap } from 'rxjs/operators/switchMap';
import { concatMap } from 'rxjs/operators/concatMap';
import { tap } from 'rxjs/operators/tap';
import { delay } from 'rxjs/operators/delay';

import { LocationDto, PositionDto } from '../shared/public-api';

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
    private accuWeatherGetCurrentWeatherUrl = 'http://dataservice.accuweather.com/currentconditions/v1/';

    private apixuGetTenDaysWeatherUrl = 'http://api.apixu.com/v1/forecast.json?';

    private geoBytesGetLocationUrl = 'http://gd.geobytes.com/GetCityDetails?callback=?';

    constructor(private readonly httpService: HttpService) {
        this.weatherStateSource = new Subject();
        this.weatherStateSubject = this.weatherStateSource.asObservable();
    }

    public getWeather(locationDto: LocationDto) {
        const retryPipeline =
            retryWhen(error => error.pipe(
                concatMap((e, i) =>
                    iif(
                        () => i > 10,
                        throwError(e),
                        of(e).pipe(delay(3000)),
                    )
                ),
                tap(() => console.log('Request error, retrying...', error)),
            ));

        let getLocationKeyUrl = this.accuWeatherGetLocationKeyUrl;
        let getCurrentWeatherUrl = this.accuWeatherGetCurrentWeatherUrl;
        let getFiveDaysWeatherUrl =  this.accuWeatherGetFiveDaysWeatherUrl;
        let getTwelveHoursWeatherUrl = this.accuWeatherGetTwelveHoursWeatherUrl;
        let getTenDaysWeatherUrl = this.apixuGetTenDaysWeatherUrl;
        let locationKey: any;

        getLocationKeyUrl += `${locationDto.countryCode}/search?apikey=${this.accuWeatherApikey}&q=${locationDto.city}`;

        return this.httpService
            .get(getLocationKeyUrl)
            .pipe(
                switchMap(locationData => {
                    locationKey = locationData.data[0].Key;

                    getCurrentWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}`;
                    getFiveDaysWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}`;
                    getTwelveHoursWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}&language=en&details=true&metric=true`;
                    getTenDaysWeatherUrl += `key=${this.apixuApikey}&q=${locationDto.city}&days=10`;

                    const currentWeather = this.httpService
                        .get(getCurrentWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            retryPipeline,
                            // retryWhen(error => error
                            //     .pipe(
                            //         delayWhen(() => timer(5000)),
                            //         tap(() => console.log('Current weather request error, retrying...', error))
                            //     )
                            // ),
                        );

                    const fiveDaysWeather = this.httpService
                        .get(getFiveDaysWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            retryPipeline,
                            // retryWhen(error => error
                            //     .pipe(
                            //         delayWhen(() => timer(5000)),
                            //         tap(() => console.log('Five days weather request error, retrying...', error)),
                            //         take(5),
                            //     )
                            // ),
                        );

                    const twelveHoursWeather = this.httpService
                        .get(getTwelveHoursWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            retryPipeline,
                            // retryWhen(error => error
                            //     .pipe(
                            //         delayWhen(() => timer(5000)),
                            //         tap(() => console.log('Twelve hours weather request error, retrying...', error))
                            //     )
                            // )
                        );

                    const tenDaysWeather = this.httpService
                        .get(getTenDaysWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            retryPipeline,
                            // retryWhen(error => error
                            //     .pipe(
                            //         delayWhen(() => timer(5000)),
                            //         tap(() => console.log('Ten days weather request error, retrying...', error))
                            //     )
                            // ),
                        );

                    return combineLatest(tenDaysWeather, fiveDaysWeather, twelveHoursWeather, currentWeather);
                }),
                retryPipeline,
                // retryWhen(error => error
                //     .pipe(
                //         delayWhen(() => timer(5000)),
                //         tap(() => console.log('Location request error, retrying...', error))
                //     )
                // ),
            );
    }

    public getLocation(positionDto: PositionDto) {
        let getLocationUrl = this.accuWeatherGetLocationUrl;
        getLocationUrl += `?apikey=${this.accuWeatherApikey}&q=${positionDto.latitude}%${positionDto.longitude}`;

        // TODO: this works without request data
        this.httpService.get(getLocationUrl).subscribe(data => console.log(data));
    }
}
