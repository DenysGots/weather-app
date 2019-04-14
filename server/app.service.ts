import { Injectable, HttpService } from '@nestjs/common';
import { combineLatest, Observable, Subject, timer, iif, throwError, of } from 'rxjs';
import { delayWhen } from 'rxjs/operators/delayWhen';
import { map } from 'rxjs/operators/map';
import { retryWhen } from 'rxjs/operators/retryWhen';
import { switchMap } from 'rxjs/operators/switchMap';
import { concatMap } from 'rxjs/operators/concatMap';
import { tap } from 'rxjs/operators/tap';
import { delay } from 'rxjs/operators/delay';
import * as moment from 'moment';

import {
    AccuWeatherCodes,
    ApixuWeatherCodes,
    DaysForecast,
    HoursForecast,
    LocationDto,
    Overcast,
    PositionDto,
    State,
    TimeOfDay,
    WeatherTypes,
    WindDirections,
} from '../shared/public-api';

@Injectable()
export class AppService {
    public weatherStateSubject: Observable<any>;

    private weatherStateSource: Subject<any>;
    private overcast: Overcast;
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

    public getLocation(positionDto: PositionDto) {
        let getLocationUrl = this.accuWeatherGetLocationUrl;
        getLocationUrl += `?apikey=${this.accuWeatherApikey}&q=${positionDto.latitude}%${positionDto.longitude}`;
        this.httpService.get(getLocationUrl).subscribe(data => console.log(data));
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

    public adjustReceivedData(weatherData: any): State {
        const weatherState = <State>{};

        weatherState.currentTime = this.setCurrentTime(weatherData[0].location.localtime);
        weatherState.dayLength = this.setDayLength(weatherData[0].forecast.forecastday[0].astro);
        weatherState.nightLength = this.setNightLength(weatherState.dayLength);
        weatherState.timeOfDay = this.setTimeOfDay(weatherState.currentTime, weatherState.dayLength, weatherState.nightLength);
        weatherState.humidityCurrent = weatherData[0].current.humidity;
        weatherState.temperatureCurrent = weatherData[0].current.temp_c;
        weatherState.temperatureFeelsLike = weatherData[0].current.feelslike_c;
        weatherState.airPressure = Math.trunc(weatherData[0].current.pressure_mb / 1.333);
        weatherState.uvIndex = weatherData[0].current.uv;
        weatherState.windSpeed = weatherData[0].current.wind_kph;
        weatherState.weatherDefinition = weatherData[0].current.condition.text;
        weatherState.foggy = this.isFog(weatherData[0].current.condition.code);
        weatherState.cloudy = this.isCloud(weatherData[0].current.condition.code);
        weatherState.rainy = this.isRain(weatherData[0].current.condition.code);
        weatherState.snowy = this.isSnow(weatherData[0].current.condition.code);
        weatherState.overcast = this.overcast;
        weatherState.weatherType = this.setWeatherTypeAccuWeather(weatherData[3][0].WeatherIcon, weatherState.timeOfDay);
        weatherState.windDirection = this.setWindDirection(weatherData[0].current.wind_degree);
        weatherState.daysForecast = this.setDaysForecast(weatherData[0].forecast.forecastday);
        weatherState.hoursForecast = this.setHoursForecast(
            weatherData[2],
            weatherState.dayLength,
            weatherState.nightLength,
            weatherState.currentTime
        );

        return weatherState;
    }

    public isFog(code: number): boolean {
        return ApixuWeatherCodes.fogCodes.indexOf(code) !== -1;
    }

    public isCloud(code: number): boolean {
        for (const prop in ApixuWeatherCodes.cloudsCodes) {
            if (ApixuWeatherCodes.cloudsCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.cloudsCodes[prop].indexOf(code) !== -1) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        this.overcast = Overcast.light;
        return false;
    }

    public isRain(code: number): boolean {
        for (const prop in ApixuWeatherCodes.rainCodes) {
            if (ApixuWeatherCodes.rainCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.rainCodes[prop].indexOf(code) !== -1) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public isSnow(code: number): boolean {
        for (const prop in ApixuWeatherCodes.snowCodes) {
            if (ApixuWeatherCodes.snowCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.snowCodes[prop].indexOf(code) !== -1) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public setDayLength(astroData): number {
        let sunRiseTime: moment.Moment;
        let sunSetTime: moment.Moment;
        let sunRise = astroData.sunrise;
        let sunSet = astroData.sunset;

        sunRise = sunRise.split('');
        sunRise.splice(sunRise.indexOf(':'), 1);
        sunRise.splice(sunRise.indexOf(' '), 3);

        sunSet = sunSet.split('');
        sunSet.splice(sunSet.indexOf(':'), 1);
        sunSet.splice(sunSet.indexOf(' '), 3);

        sunRiseTime = moment()
            .hours(parseInt(sunRise.slice(0, 2).join(''), 10))
            .minutes(parseInt(sunRise.slice(2, 2).join(''), 10));
        sunSetTime = moment()
            .hours(parseInt(sunSet.slice(0, 2).join(''), 10) + 12)
            .minutes(parseInt(sunSet.slice(2, 2).join(''), 10));

        return moment.duration(sunSetTime.diff(sunRiseTime)).as('milliseconds');
    }

    public setNightLength(dayLength: number): number {
        return 86400000 - dayLength;
    }

    public setCurrentTime(time?: string): number {
        const currentTime: moment.Moment = time ? moment(time) : moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    public setTimeOfDay(currentTime: number, dayLength: number, nightLength: number, date?: string): TimeOfDay {
        const currentHour: number = date
            ? moment.duration(this.setCurrentTime(date)).hours()
            : moment.duration(currentTime).hours();
        const dayHours: number = moment.duration(dayLength).hours();
        const nightHours: number = moment.duration(nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        return isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public setWeatherTypeApixu(code: number): WeatherTypes {
        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        switch (true) {
            case compareCodes(ApixuWeatherCodes.dayClearCodes):
                return WeatherTypes.dayClear;
                break;

            case compareCodes(ApixuWeatherCodes.dayLightCloudsCodes):
                return WeatherTypes.dayLightClouds;
                break;

            case compareCodes(ApixuWeatherCodes.dayMediumCloudsCodes):
                return WeatherTypes.dayMediumClouds;
                break;

            case compareCodes(ApixuWeatherCodes.dayHeavyCloudsCodes):
                return WeatherTypes.dayHeavyClouds;
                break;

            case compareCodes(ApixuWeatherCodes.dayLightRainCodes):
                return WeatherTypes.dayLightRain;
                break;

            case compareCodes(ApixuWeatherCodes.dayMediumRainCodes):
                return WeatherTypes.dayMediumRain;
                break;

            case compareCodes(ApixuWeatherCodes.dayHeavyRainCodes):
                return WeatherTypes.dayHeavyRain;
                break;

            case compareCodes(ApixuWeatherCodes.dayLightSnowCodes):
                return WeatherTypes.dayLightSnow;
                break;

            case compareCodes(ApixuWeatherCodes.dayMediumSnowCodes):
                return WeatherTypes.dayMediumSnow;
                break;

            case compareCodes(ApixuWeatherCodes.dayHeavySnowCodes):
                return WeatherTypes.dayHeavySnow;
                break;

            default:
                return WeatherTypes.dayClear;
        }
    }

    public setWeatherTypeAccuWeather(code: number, timeOfDay: TimeOfDay): WeatherTypes {
        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        switch (true) {
            case compareCodes(AccuWeatherCodes.clearCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
                break;

            case compareCodes(AccuWeatherCodes.lightCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
                break;

            case compareCodes(AccuWeatherCodes.mediumCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
                break;

            case compareCodes(AccuWeatherCodes.heavyCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.dayHeavyClouds;
                break;

            case compareCodes(AccuWeatherCodes.lightRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
                break;

            case compareCodes(AccuWeatherCodes.mediumRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
                break;

            case compareCodes(AccuWeatherCodes.heavyRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
                break;

            case compareCodes(AccuWeatherCodes.lightSnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
                break;

            case compareCodes(AccuWeatherCodes.mediumSnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
                break;

            case compareCodes(AccuWeatherCodes.heavySnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavySnow : WeatherTypes.nightHeavySnow;
                break;

            default:
                return WeatherTypes.dayClear;
        }
    }

    public setWindDirection(windAngle): WindDirections {
        function calculateBoundaries(angle) {
            const delta = 45 / 2;
            return (windAngle >= (angle - delta)) && (windAngle < (angle + delta));
        }

        switch (calculateBoundaries(windAngle)) {
            case calculateBoundaries(0) || calculateBoundaries(360):
                return WindDirections.north;
                break;

            case calculateBoundaries(45):
                return WindDirections.northEast;
                break;

            case calculateBoundaries(90):
                return WindDirections.east;
                break;

            case calculateBoundaries(135):
                return WindDirections.eastSouth;
                break;

            case calculateBoundaries(180):
                return WindDirections.south;
                break;

            case calculateBoundaries(225):
                return WindDirections.southWest;
                break;

            case calculateBoundaries(270):
                return WindDirections.west;
                break;

            case calculateBoundaries(315):
                return WindDirections.westNorth;
                break;

            default:
                return WindDirections.north;
        }
    }

    public setHoursForecast(hoursData, dayLength, nightLength, currentTime): HoursForecast[] {
        return hoursData.map(hourData => {
            const timeOfDay: TimeOfDay = this.setTimeOfDay(currentTime, dayLength, nightLength, hourData.DateTime);
            const weatherType: WeatherTypes = this.setWeatherTypeAccuWeather(hourData.WeatherIcon, timeOfDay);
            const windDirection: WindDirections = this.setWindDirection(hourData.Wind.Direction.Degrees);

            return {
                hourTime: moment(hourData.DateTime).minutes(0).format('HH:mm'),
                weatherTypeHour: weatherType,
                humidityCurrent: hourData.RelativeHumidity,
                temperatureCurrent: hourData.Temperature.Value,
                windSpeedCurrent: hourData.Wind.Speed.Value,
                windDirectionCurrent: windDirection,
                uvIndexCurrent: hourData.UVIndex,
            };
        });
    }

    public setDaysForecast(daysData): DaysForecast[] {
        return daysData.map(dayData => {
            const weatherType: WeatherTypes =  this.setWeatherTypeApixu(dayData.day.condition.code);

            return  {
                dayDate: moment(dayData.date).format('D MMM'),
                weatherTypeDay: weatherType,
                temperatureMin: dayData.day.mintemp_c,
                temperatureMax: dayData.day.maxtemp_c,
                humidity: dayData.day.avghumidity,
                uvIndex: dayData.day.uv,
            };
        });
    }
}
