import { every } from 'lodash/fp';
import * as moment from 'moment';
import { combineLatest, iif, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, delay, map, retryWhen, switchMap, tap } from 'rxjs/operators';

import { HttpService, Injectable } from '@nestjs/common';

import {
  AccuWeatherCodes,
  DaysForecast,
  HoursForecast,
  LocationDto,
  Overcast,
  State,
  TimeOfDay,
  WeatherbitWeatherCodes,
  WeatherCodes,
  WeatherTypes,
  WindDirections
} from '../shared/public-api';

@Injectable()
export class AppService {
  public weatherStateSubject: Observable<any>;

  private weatherStateSource: Subject<any>;
  private overcast: Overcast;
  private locationData: LocationDto;
  private ipgeolocationApikey = 'f7f993429c6e41e984e28f3a964c1d1d';
  private accuWeatherApikey = 'rpu3K5yQuA9IogpqOTDmX9hTEWXKnI0I';
  private weatherbitkey = '21d8d5888e2c42dca7d3ac7ee3ca5208';
  private accuWeatherGetLocationKeyUrl = 'http://dataservice.accuweather.com/locations/v1/cities/';
  private accuWeatherGetTwelveHoursWeatherUrl = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
  private accuWeatherGetCurrentWeatherUrl = 'http://dataservice.accuweather.com/currentconditions/v1/';
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
      tap(() => console.log('Request error, retrying...'/*, error*/)), // TODO: uncomment
    ));

  constructor(private readonly httpService: HttpService) {
    this.weatherStateSource = new Subject();
    this.weatherStateSubject = this.weatherStateSource.asObservable();
  }

  public getLocation(clientIp: string): Observable<any> {
    const clearedIp = this.clearIpAddress(clientIp);
    const getLocationUrl =
      `https://api.ipgeolocation.io/ipgeo?apiKey=${this.ipgeolocationApikey}&ip=${clearedIp}&fields=geo`;

    console.log('clientIp: ', clientIp);
    console.log('clearedIp: ', clearedIp);
    console.log('getLocationUrl: ', getLocationUrl);

    return this.httpService
      .get(getLocationUrl)
      .pipe(
        map((location: any) => this.mapLocationDto(location.data)),
        tap((location: any) => (this.locationData = location)),
        this.retryPipeline
      );
  }

  public getWeather(location: LocationDto): Observable<any> {
    let getLocationKeyUrl = this.accuWeatherGetLocationKeyUrl;
    let getSixteenDaysWeatherUrl = this.weatherbitSixteenDaysWeatherUrl;
    let getTwelveHoursWeatherUrl = this.accuWeatherGetTwelveHoursWeatherUrl;
    let getCurrentWeatherUrl = this.accuWeatherGetCurrentWeatherUrl;
    let locationKey: any;

    console.log('location: ', location);

    getLocationKeyUrl += `${location.countryCode}/search?apikey=${this.accuWeatherApikey}&q=${location.city}`;

    console.log('getLocationKeyUrl: ', getLocationKeyUrl);

    return this.httpService
      .get(getLocationKeyUrl)
      .pipe(
        switchMap(locationData => {
          locationKey = locationData.data[0].Key;

          console.log('locationData: ', locationData);

          getSixteenDaysWeatherUrl +=
            `city=${location.city}&country=${location.country}&key=${this.weatherbitkey}`;
          getTwelveHoursWeatherUrl +=
            `${locationKey}?apikey=${this.accuWeatherApikey}&language=en&details=true&metric=true`;
          getCurrentWeatherUrl +=
            `${locationKey}?details=true&apikey=${this.accuWeatherApikey}`;

          const sixteenDaysWeather = this.httpService
            .get(getSixteenDaysWeatherUrl)
            .pipe(
              map(weatherData => weatherData.data.data),
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

          return combineLatest(sixteenDaysWeather, twelveHoursWeather, currentWeather);
        }),
        this.retryPipeline
      );
  }

  public adjustReceivedData(weatherData: any): State {
    const weatherState = {} as State;

    weatherState.locationData = this.locationData;
    weatherState.currentTime = this.setCurrentTime(weatherData[2][0].LocalObservationDateTime);
    weatherState.dayLength = this.setDayTimeLength(weatherData[0][0].sunrise_ts, weatherData[0][0].sunset_ts);
    weatherState.nightLength = this.setNightTimeLength(weatherState.dayLength);
    weatherState.timeOfDay = this.setTimeOfDay(
      weatherState.currentTime,
      weatherState.dayLength,
      weatherState.nightLength
    );
    weatherState.humidityCurrent = weatherData[2][0].RelativeHumidity;
    weatherState.temperatureCurrent = weatherData[2][0].Temperature.Metric.Value;
    weatherState.temperatureFeelsLike = weatherData[2][0].RealFeelTemperature.Metric.Value;
    weatherState.airPressure = Math.trunc(weatherData[2][0].Pressure.Metric.Value / 1.333);
    weatherState.uvIndex = weatherData[2][0].UVIndex;
    weatherState.windSpeed = weatherData[2][0].Wind.Speed.Metric.Value;
    weatherState.windDirection = this.setWindDirection(weatherData[2][0].Wind.Direction.Degrees);
    weatherState.weatherDefinition = weatherData[2][0].WeatherText;
    weatherState.foggy = this.isWeatherOfType(weatherData[2][0].WeatherIcon, WeatherCodes.fogCodes);
    weatherState.cloudy = this.isWeatherOfType(weatherData[2][0].WeatherIcon, WeatherCodes.cloudsCodes);
    weatherState.rainy = this.isWeatherOfType(weatherData[2][0].WeatherIcon, WeatherCodes.rainCodes);
    weatherState.snowy = this.isWeatherOfType(weatherData[2][0].WeatherIcon, WeatherCodes.snowCodes);
    weatherState.overcast = this.overcast;
    weatherState.weatherType = this.setWeatherTypeAccuWeather(weatherData[2][0].WeatherIcon, weatherState.timeOfDay);
    weatherState.daysForecast = this.setDaysForecast(weatherData[0]);
    weatherState.hoursForecast = this.setHoursForecast(
      weatherData[1],
      weatherState.dayLength,
      weatherState.nightLength,
      weatherState.currentTime
    );

    return weatherState;
  }

  private isWeatherOfType(code: number, weatherCode: WeatherCodes) {
    if (weatherCode === WeatherCodes.fogCodes) {
      return AccuWeatherCodes[weatherCode].indexOf(code) !== -1;
    }

    for (const prop in AccuWeatherCodes[weatherCode]) {
      if (
        AccuWeatherCodes[weatherCode].hasOwnProperty(prop) &&
        AccuWeatherCodes[weatherCode][prop].indexOf(code) !== -1
      ) {
        this.overcast = Overcast[prop];
        return true;
      }
    }

    this.overcast = Overcast.light;
    return false;
  }

  private setDayTimeLength(dayStart: number, dayEnd: number): number {
    const sunRise: moment.Moment = moment.unix(dayStart);
    const sunSet: moment.Moment = moment.unix(dayEnd);
    return moment.duration(sunSet.diff(sunRise)).as('milliseconds');
  }

  private setNightTimeLength(dayTimeLength: number): number {
    const dayLength = 86400000;
    return dayLength - dayTimeLength;
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
    const isNight: boolean =
      (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);

    return isNight ? TimeOfDay.night : TimeOfDay.day;
  }

  private setWeatherTypeAccuWeather(code: number, timeOfDay: TimeOfDay): WeatherTypes {
    const compareWeatherCodes = this.compareCodes(code);

    switch (true) {
      case compareWeatherCodes(AccuWeatherCodes.clearCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
      case compareWeatherCodes(AccuWeatherCodes.lightCloudsCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
      case compareWeatherCodes(AccuWeatherCodes.mediumCloudsCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
      case compareWeatherCodes(AccuWeatherCodes.heavyCloudsCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.nightHeavyClouds;
      case compareWeatherCodes(AccuWeatherCodes.lightRainCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
      case compareWeatherCodes(AccuWeatherCodes.mediumRainCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
      case compareWeatherCodes(AccuWeatherCodes.heavyRainCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
      case compareWeatherCodes(AccuWeatherCodes.lightSnowCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
      case compareWeatherCodes(AccuWeatherCodes.mediumSnowCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
      case compareWeatherCodes(AccuWeatherCodes.heavySnowCodes):
        return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavySnow : WeatherTypes.nightHeavySnow;
      default:
        return WeatherTypes.dayClear;
    }
  }

  private setWeatherTypeWeatherbit(code: number): WeatherTypes {
    const compareWeatherCodes = this.compareCodes(code);

    switch (true) {
      case compareWeatherCodes(WeatherbitWeatherCodes.dayClearCodes):
        return WeatherTypes.dayClear;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayLightCloudsCodes):
        return WeatherTypes.dayLightClouds;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayMediumCloudsCodes):
        return WeatherTypes.dayMediumClouds;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayHeavyCloudsCodes):
        return WeatherTypes.dayHeavyClouds;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayLightRainCodes):
        return WeatherTypes.dayLightRain;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayMediumRainCodes):
        return WeatherTypes.dayMediumRain;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayHeavyRainCodes):
        return WeatherTypes.dayHeavyRain;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayLightSnowCodes):
        return WeatherTypes.dayLightSnow;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayMediumSnowCodes):
        return WeatherTypes.dayMediumSnow;
      case compareWeatherCodes(WeatherbitWeatherCodes.dayHeavySnowCodes):
        return WeatherTypes.dayHeavySnow;
      default:
        return WeatherTypes.dayClear;
    }
  }

  private compareCodes(code: number): (codes: any[]) => boolean {
    return (codes: any[]) => codes.some(elem => code === elem);
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
      const timeOfDay: TimeOfDay =
        this.setTimeOfDay(currentTime, dayLength, nightLength, hourData.DateTime);
      const weatherType: WeatherTypes =
        this.setWeatherTypeAccuWeather(hourData.WeatherIcon, timeOfDay);
      const windDirection: WindDirections =
        this.setWindDirection(hourData.Wind.Direction.Degrees);

      return {
        hourTime: moment(hourData.DateTime).minutes(0).format('HH:mm'),
        weatherTypeHour: weatherType,
        humidityCurrent: hourData.RelativeHumidity,
        temperatureCurrent: hourData.Temperature.Value,
        windSpeedCurrent: hourData.Wind.Speed.Value,
        windDirectionCurrent: windDirection,
        uvIndexCurrent: hourData.UVIndex
      };
    });
  }

  private setDaysForecast(daysData: any): DaysForecast[] {
    return daysData.map(dayData => {
      const weatherType: WeatherTypes = this.setWeatherTypeWeatherbit(dayData.weather.code);

      return  {
        dayDate: moment(dayData.datetime).format('D MMM'),
        weatherTypeDay: weatherType,
        temperatureMax: dayData.max_temp,
        temperatureMin: dayData.min_temp,
        humidity: dayData.rh,
        uvIndex: parseFloat(dayData.uv).toFixed(2),
      };
    });
  }

  private clearIpAddress(clientIp: string): string {
    return clientIp.includes('::ffff:')
      ? clientIp.replace(/::ffff:/, '')
      : clientIp;
  }

  private mapLocationDto(clientLocation: any): LocationDto {
    console.log('clientLocation: ', clientLocation);

    const defaultLocation = { countryCode: 'UA', country: 'Ukraine', city: 'Kyiv' };

    const {
      country_code2: countryCode = null,
      country_name: country = null,
      city = null
    } = clientLocation || {};

    const location = { countryCode, country, city };

    // TODO: default to { countryCode: 'UA', country: 'Ukraine', city: 'Kyiv' } if any of the fields above is empty

    // return {
    //   countryCode,
    //   country,
    //   city
    // };

    console.log('mapped clientLocation: ', every(entry => !!entry, location) ? location : defaultLocation);

    return every(entry => !!entry, location) ? location : defaultLocation;
  }
}
