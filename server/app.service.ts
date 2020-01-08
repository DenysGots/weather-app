import * as moment from 'moment';
import { combineLatest, iif, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, delay, map, retryWhen, switchMap, tap } from 'rxjs/operators';

import { HttpService, Injectable } from '@nestjs/common';

import {
    AccuWeatherCodes,
    // ApixuWeatherCodes,
    DaysForecast,
    HoursForecast,
    LocationDto,
    Overcast,
    State,
    TimeOfDay,
    WeatherTypes,
    WindDirections,
    WeatherbitWeatherCodes
} from '../shared/public-api';

@Injectable()
export class AppService {
    public weatherStateSubject: Observable<any>;

    private weatherStateSource: Subject<any>;
    private overcast: Overcast;
    private ipgeolocationApikey = 'f7f993429c6e41e984e28f3a964c1d1d';
    private accuWeatherApikey = 'rpu3K5yQuA9IogpqOTDmX9hTEWXKnI0I';
    // private apixuApikey = 'abcf9bd6ce4b40b29d7170831191703';
    private weatherbitkey = '21d8d5888e2c42dca7d3ac7ee3ca5208';
    private accuWeatherGetLocationKeyUrl = 'http://dataservice.accuweather.com/locations/v1/cities/';
    private accuWeatherGetFiveDaysWeatherUrl = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
    private accuWeatherGetTwelveHoursWeatherUrl = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/{locationKey}';
    private accuWeatherGetCurrentWeatherUrl = 'http://dataservice.accuweather.com/currentconditions/v1/';
    // private apixuGetTenDaysWeatherUrl = 'http://api.apixu.com/v1/forecast.json?';
    private weatherbitSixteenDaysWeatherUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';

    private retryPipeline =
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

    constructor(private readonly httpService: HttpService) {
        this.weatherStateSource = new Subject();
        this.weatherStateSubject = this.weatherStateSource.asObservable();
    }

    public getLocation(clientIp: string): Observable<any> {
        const clearedIp = this.clearIpAddress(clientIp);
        const getLocationUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${this.ipgeolocationApikey}&ip=${clearedIp}&fields=geo`;

        // { countryCode: 'UA', country: 'Ukraine', city: 'Kyiv' } // mock location

        return this.httpService
            .get(getLocationUrl)
            .pipe(
                map((location: any) => this.mapLocationDto(location.data)),
                this.retryPipeline
            );
    }

    // TODO: update to new api
    public getWeather(locationDto: LocationDto): Observable<any> {
        let getLocationKeyUrl = this.accuWeatherGetLocationKeyUrl;
        // let getTenDaysWeatherUrl = this.apixuGetTenDaysWeatherUrl;
        let getSixteenDaysWeatherUrl = this.weatherbitSixteenDaysWeatherUrl;
        let getFiveDaysWeatherUrl =  this.accuWeatherGetFiveDaysWeatherUrl;
        let getTwelveHoursWeatherUrl = this.accuWeatherGetTwelveHoursWeatherUrl;
        let getCurrentWeatherUrl = this.accuWeatherGetCurrentWeatherUrl;
        let locationKey: any;

        getLocationKeyUrl += `${locationDto.countryCode}/search?apikey=${this.accuWeatherApikey}&q=${locationDto.city}`;

        return this.httpService
            .get(getLocationKeyUrl)
            .pipe(
                switchMap(locationData => {
                    locationKey = locationData.data[0].Key;

                    // getTenDaysWeatherUrl += `key=${this.apixuApikey}&q=${locationDto.city}&days=10`;
                    getSixteenDaysWeatherUrl += `city=${locationDto.city}&country=${locationDto.country}&key=${this.weatherbitkey}`;
                    getFiveDaysWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}`;
                    getTwelveHoursWeatherUrl += `${locationKey}?apikey=${this.accuWeatherApikey}&language=en&details=true&metric=true`;
                    getCurrentWeatherUrl += `${locationKey}?details=true&apikey=${this.accuWeatherApikey}`;

                    // const tenDaysWeather = this.httpService
                    //     .get(getTenDaysWeatherUrl)
                    //     .pipe(
                    //         map(weatherData => weatherData.data),
                    //         this.retryPipeline
                    //     );

                    const sixteenDaysWeather = this.httpService
                        .get(getSixteenDaysWeatherUrl)
                        .pipe(
                            // TODO: check
                            tap(weatherData => console.log(weatherData.data)),
                            map(weatherData => weatherData.data),
                            this.retryPipeline
                        );

                    const fiveDaysWeather = this.httpService
                        .get(getFiveDaysWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            this.retryPipeline
                        );

                    const twelveHoursWeather = this.httpService
                        .get(getTwelveHoursWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            this.retryPipeline
                        );

                    const currentWeather = this.httpService
                        .get(getCurrentWeatherUrl)
                        .pipe(
                            map(weatherData => weatherData.data),
                            this.retryPipeline
                        );

                    // return combineLatest(tenDaysWeather fiveDaysWeather, twelveHoursWeather, currentWeather);
                    return combineLatest(sixteenDaysWeather, fiveDaysWeather, twelveHoursWeather, currentWeather);
                }),
                this.retryPipeline
            );
    }

    public adjustReceivedData(weatherData: any): State {
        const weatherState = <State>{};

        // TODO: update to weatherData[3] data
        weatherState.currentTime = this.setCurrentTime(weatherData[3].LocalObservationDateTime);
        // TODO: update to weatherData[0][0] data
        weatherState.dayLength = this.setDayLength(weatherData.data[0].sunrise, weatherData.data[0].sunset);
        weatherState.nightLength = this.setNightLength(weatherState.dayLength);
        weatherState.timeOfDay = this.setTimeOfDay(
            weatherState.currentTime,
            weatherState.dayLength,
            weatherState.nightLength
        );
        // TODO: update to weatherData[3] data
        weatherState.humidityCurrent = weatherData[3].RelativeHumidity;
        // TODO: update to weatherData[3] data
        weatherState.temperatureCurrent = weatherData[3].Temperature.Metric.Value;
        // TODO: update to weatherData[3] data
        weatherState.temperatureFeelsLike = weatherData[3].RealFeelTemperature.Metric.Value;
        // TODO: update to weatherData[3] data
        weatherState.airPressure = Math.trunc(weatherData[3].Pressure.Metric.Value / 1.333);
        // TODO: update to weatherData[3] data
        weatherState.uvIndex = weatherData[3].UVIndex;
        // TODO: update to weatherData[3] data
        weatherState.windSpeed = weatherData[3].Wind.Speed.Metric.Value;
        // TODO: update to weatherData[3] data
        weatherState.windDirection = this.setWindDirection(weatherData[3].Wind.Direction.Degrees);
        // TODO: update to weatherData[3] data
        weatherState.weatherDefinition = weatherData[3].WeatherText;
        // TODO: update to weatherData[3] data
        weatherState.foggy = this.isFog(weatherData[3].WeatherIcon);
        // TODO: update to weatherData[3] data
        weatherState.cloudy = this.isCloud(weatherData[3].WeatherIcon);
        // TODO: update to weatherData[3] data
        weatherState.rainy = this.isRain(weatherData[3].WeatherIcon);
        // TODO: update to weatherData[3] data
        weatherState.snowy = this.isSnow(weatherData[3].WeatherIcon);
        weatherState.overcast = this.overcast;
        weatherState.weatherType = this.setWeatherTypeAccuWeather(weatherData[3][0].WeatherIcon, weatherState.timeOfDay);
        // TODO: update to new weatherData[0] data
        weatherState.daysForecast = this.setDaysForecast(weatherData[0].data);
        weatherState.hoursForecast = this.setHoursForecast(
            weatherData[2],
            weatherState.dayLength,
            weatherState.nightLength,
            weatherState.currentTime
        );

        return weatherState;
    }

    // TODO: refactor this 4 into 1 using isWeather {snow: 'snow', ...} enum
    private isFog(code: number): boolean {
        return AccuWeatherCodes.fogCodes.indexOf(code) !== -1;
    }

    private isCloud(code: number): boolean {
        for (const prop in AccuWeatherCodes.cloudsCodes) {
            if (
                AccuWeatherCodes.cloudsCodes.hasOwnProperty(prop) &&
                AccuWeatherCodes.cloudsCodes[prop].indexOf(code) !== -1
            ) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        this.overcast = Overcast.light;
        return false;
    }

    private isRain(code: number): boolean {
        for (const prop in AccuWeatherCodes.rainCodes) {
            if (
                AccuWeatherCodes.rainCodes.hasOwnProperty(prop) &&
                AccuWeatherCodes.rainCodes[prop].indexOf(code) !== -1
            ) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    private isSnow(code: number): boolean {
        for (const prop in AccuWeatherCodes.snowCodes) {
            if (
                AccuWeatherCodes.snowCodes.hasOwnProperty(prop) &&
                AccuWeatherCodes.snowCodes[prop].indexOf(code) !== -1
            ) {
                this.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    private setDayLength(sunrise: string, sunset: string): number {
        let sunRiseTime: moment.Moment;
        let sunSetTime: moment.Moment;
        // let sunRise = astroData.sunrise;
        // let sunSet = astroData.sunset;
        //
        // sunRise = sunRise.split('');
        // sunRise.splice(sunRise.indexOf(':'), 1);
        // sunRise.splice(sunRise.indexOf(' '), 3);
        //
        // sunSet = sunSet.split('');
        // sunSet.splice(sunSet.indexOf(':'), 1);
        // sunSet.splice(sunSet.indexOf(' '), 3);

        sunRiseTime = moment()
            .hours(parseInt(sunrise.slice(0, 2).join(''), 10))
            .minutes(parseInt(sunrise.slice(3, 2).join(''), 10));
        sunSetTime = moment()
            .hours(parseInt(sunset.slice(0, 2).join(''), 10) + 12)
            .minutes(parseInt(sunset.slice(3, 2).join(''), 10));

        return moment.duration(sunSetTime.diff(sunRiseTime)).as('milliseconds');
    }

    private setNightLength(dayLength: number): number {
        return 86400000 - dayLength;
    }

    private setCurrentTime(time?: string): number {
        const currentTime: moment.Moment = time ? moment(time) : moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);

        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    private setTimeOfDay(
        currentTime: number,
        dayLength: number,
        nightLength: number,
        date?: string
    ): TimeOfDay {
        const currentHour: number = date
            ? moment.duration(this.setCurrentTime(date)).hours()
            : moment.duration(currentTime).hours();
        const dayHours: number = moment.duration(dayLength).hours();
        const nightHours: number = moment.duration(nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);

        return isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    // private setWeatherTypeApixu(code: number): WeatherTypes {
    //     function compareCodes(codes: any[]) {
    //         return codes.some(elem => code === elem);
    //     }
    //
    //     switch (true) {
    //         case compareCodes(ApixuWeatherCodes.dayClearCodes):
    //             return WeatherTypes.dayClear;
    //         case compareCodes(ApixuWeatherCodes.dayLightCloudsCodes):
    //             return WeatherTypes.dayLightClouds;
    //         case compareCodes(ApixuWeatherCodes.dayMediumCloudsCodes):
    //             return WeatherTypes.dayMediumClouds;
    //         case compareCodes(ApixuWeatherCodes.dayHeavyCloudsCodes):
    //             return WeatherTypes.dayHeavyClouds;
    //         case compareCodes(ApixuWeatherCodes.dayLightRainCodes):
    //             return WeatherTypes.dayLightRain;
    //         case compareCodes(ApixuWeatherCodes.dayMediumRainCodes):
    //             return WeatherTypes.dayMediumRain;
    //         case compareCodes(ApixuWeatherCodes.dayHeavyRainCodes):
    //             return WeatherTypes.dayHeavyRain;
    //         case compareCodes(ApixuWeatherCodes.dayLightSnowCodes):
    //             return WeatherTypes.dayLightSnow;
    //         case compareCodes(ApixuWeatherCodes.dayMediumSnowCodes):
    //             return WeatherTypes.dayMediumSnow;
    //         case compareCodes(ApixuWeatherCodes.dayHeavySnowCodes):
    //             return WeatherTypes.dayHeavySnow;
    //         default:
    //             return WeatherTypes.dayClear;
    //     }
    // }


    // TODO: combine these 2 into 1 with enum
    private setWeatherTypeAccuWeather(code: number, timeOfDay: TimeOfDay): WeatherTypes {
        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        switch (true) {
            case compareCodes(AccuWeatherCodes.clearCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
            case compareCodes(AccuWeatherCodes.lightCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
            case compareCodes(AccuWeatherCodes.mediumCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
            case compareCodes(AccuWeatherCodes.heavyCloudsCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.nightHeavyClouds;
            case compareCodes(AccuWeatherCodes.lightRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
            case compareCodes(AccuWeatherCodes.mediumRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
            case compareCodes(AccuWeatherCodes.heavyRainCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
            case compareCodes(AccuWeatherCodes.lightSnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
            case compareCodes(AccuWeatherCodes.mediumSnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
            case compareCodes(AccuWeatherCodes.heavySnowCodes):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavySnow : WeatherTypes.nightHeavySnow;
            default:
                return WeatherTypes.dayClear;
        }
    }

    private setWeatherTypeWeatherbit(code: number): WeatherTypes {
        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        switch (true) {
            case compareCodes(WeatherbitWeatherCodes.dayClearCodes):
                return WeatherTypes.dayClear;
            case compareCodes(WeatherbitWeatherCodes.dayLightCloudsCodes):
                return WeatherTypes.dayLightClouds;
            case compareCodes(WeatherbitWeatherCodes.dayMediumCloudsCodes):
                return WeatherTypes.dayMediumClouds;
            case compareCodes(WeatherbitWeatherCodes.dayHeavyCloudsCodes):
                return WeatherTypes.dayHeavyClouds;
            case compareCodes(WeatherbitWeatherCodes.dayLightRainCodes):
                return WeatherTypes.dayLightRain;
            case compareCodes(WeatherbitWeatherCodes.dayMediumRainCodes):
                return WeatherTypes.dayMediumRain;
            case compareCodes(WeatherbitWeatherCodes.dayHeavyRainCodes):
                return WeatherTypes.dayHeavyRain;
            case compareCodes(WeatherbitWeatherCodes.dayLightSnowCodes):
                return WeatherTypes.dayLightSnow;
            case compareCodes(WeatherbitWeatherCodes.dayMediumSnowCodes):
                return WeatherTypes.dayMediumSnow;
            case compareCodes(WeatherbitWeatherCodes.dayHeavySnowCodes):
                return WeatherTypes.dayHeavySnow;
            default:
                return WeatherTypes.dayClear;
        }
    }

    private setWindDirection(windAngle: any): WindDirections {
        function calculateBoundaries(angle) {
            const delta = 45 / 2;
            return (windAngle >= (angle - delta)) && (windAngle < (angle + delta));
        }

        switch (calculateBoundaries(windAngle)) {
            case calculateBoundaries(0) || calculateBoundaries(360):
                return WindDirections.north;
            case calculateBoundaries(45):
                return WindDirections.northEast;
            case calculateBoundaries(90):
                return WindDirections.east;
            case calculateBoundaries(135):
                return WindDirections.eastSouth;
            case calculateBoundaries(180):
                return WindDirections.south;
            case calculateBoundaries(225):
                return WindDirections.southWest;
            case calculateBoundaries(270):
                return WindDirections.west;
            case calculateBoundaries(315):
                return WindDirections.westNorth;
            default:
                return WindDirections.north;
        }
    }

    private setHoursForecast(
        hoursData: any,
        dayLength: any,
        nightLength: any,
        currentTime: any
    ): HoursForecast[] {
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

    // TODO: update
    private setDaysForecast(daysData: any): DaysForecast[] {
        return daysData.map(dayData => {
            const weatherType: WeatherTypes = this.setWeatherTypeWeatherbit(dayData.weather.code);

            return  {
                dayDate: moment(dayData.timestamp_local).format('D MMM'),
                weatherTypeDay: weatherType,
                temperatureMax: dayData.max_temp,
                temperatureMin: dayData.min_temp,
                humidity: dayData.rh,
                uvIndex: dayData.uv,
            };
        });
    }

    private clearIpAddress(clientIp: string): string {
        return clientIp.includes('::ffff:')
            ? clientIp.replace(/::ffff:/, '')
            : clientIp;
    }

    private mapLocationDto(clientLocation: any): LocationDto {
        const {
            country_code2: countryCode = null,
            country_name: country = null,
            city = null
        } = clientLocation || {};

        return {
            countryCode,
            country,
            city
        };
    }
}
