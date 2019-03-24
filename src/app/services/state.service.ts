import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { HelpersService } from './helpers.service';

import {
    ApixuWeatherCodes,
    DaysForecast,
    HoursForecast,
    MoonPhases,
    Overcast,
    State,
    TimeOfDay,
    WeatherDefinitions,
    WeatherTypes,
    WindDirections,
} from '../interfaces/public-api';

@Injectable()
export class StateService {
    public currentState: State = {
        overcast: Overcast.light,
        // dayLength: 50400000,
        // nightLength: 36000000,
        cloudy: false,
        rainy: false,
        snowy: false,
        foggy: false,
        weatherType: WeatherTypes.dayLightClouds,
        // weatherDefinition: WeatherDefinitions.dayLightClouds,
        // temperatureCurrent: 19,
        // temperatureFeelsLike: 14,
        // humidityCurrent: 5,
        // windSpeed: 4.5,
        // uvIndex: 3,
        // airPressure: 745,
        windDirection: WindDirections.northEast,
        moonPhase: MoonPhases.waningCrescent,
        currentTime: 12 * 60 * 60 * 1000,
    };

    constructor(private helpersService: HelpersService) { }

    // TODO: move partly logic to server, copy interfaces to shared folder and reuse on client/server
    public adjustReceivedData(weatherData: any): void {
        this.currentState.currentTime = this.setCurrentTime();
        this.currentState.dayLength = this.setDayLength(weatherData[0].forecast.forecastday[0].astro);
        this.currentState.nightLength = this.setNightLength();
        this.currentState.timeOfDay = this.setTimeOfDay();
        this.currentState.humidityCurrent = weatherData[0].current.humidity;
        this.currentState.temperatureCurrent = weatherData[0].current.temp_c;
        this.currentState.temperatureFeelsLike = weatherData[0].current.feelslike_c;
        this.currentState.airPressure = Math.trunc(weatherData[0].current.pressure_mb / 1.333);
        this.currentState.uvIndex = weatherData[0].current.uv;
        this.currentState.windSpeed = weatherData[0].current.wind_kph;
        this.currentState.weatherDefinition = weatherData[0].current.condition.text;
        this.currentState.foggy = this.isFog(weatherData[0].current.condition.code);
        this.currentState.cloudy = this.isCloud(weatherData[0].current.condition.code);
        this.currentState.rainy = this.isRain(weatherData[0].current.condition.code);
        this.currentState.snowy = this.isSnow(weatherData[0].current.condition.code);
        this.currentState.weatherType = this.setWeatherTypeAccuWeather(weatherData[3][0].WeatherIcon);
        this.currentState.windDirection = this.setWindDirection(weatherData[0].current.wind_degree);
        this.currentState.moonPhase = this.helpersService.calculateMoonPhase();
        this.currentState.hoursForecast = this.setHoursForecast(weatherData[2]);
        this.currentState.daysForecast = this.setDaysForecast(weatherData[0].forecast.forecastday);

        console.log(this.currentState);
    }

    public isFog(code): boolean {
        return ApixuWeatherCodes.fogCodes.indexOf(code) !== -1;
    }

    public isCloud(code): boolean {
        for (const prop in ApixuWeatherCodes.cloudsCodes) {
            if (ApixuWeatherCodes.cloudsCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.cloudsCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public isRain(code): boolean {
        for (const prop in ApixuWeatherCodes.rainCodes) {
            if (ApixuWeatherCodes.rainCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.rainCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
                return true;
            }
        }

        return false;
    }

    public isSnow(code): boolean {
        for (const prop in ApixuWeatherCodes.snowCodes) {
            if (ApixuWeatherCodes.snowCodes.hasOwnProperty(prop)
                && ApixuWeatherCodes.snowCodes[prop].indexOf(code) !== -1) {
                this.currentState.overcast = Overcast[prop];
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

    public setNightLength(): number {
        return 86400000 - this.currentState.dayLength;
    }

    public setCurrentTime(): number {
        // TODO: after moving to server use time from currentInformation instead of moment()
        const currentTime: moment.Moment = moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    private setTimeOfDay(): TimeOfDay {
        const currentHour: number = moment.duration(this.currentState.currentTime).hours();
        const dayHours: number = moment.duration(this.currentState.dayLength).hours();
        const nightHours: number = moment.duration(this.currentState.nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        return isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public setWeatherTypeApixu(code: number): WeatherTypes {
        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        // TODO: move codes arrays to public-api weather APIs codes
        switch (true) {
            case compareCodes([1000 || 1030 || 1135 || 1147]):
                return WeatherTypes.dayClear;
                break;

            case compareCodes([1003]):
                return WeatherTypes.dayLightClouds;
                break;

            case compareCodes([1006]):
                return WeatherTypes.dayMediumClouds;
                break;

            case compareCodes([1009]):
                return WeatherTypes.dayHeavyClouds;
                break;

            case compareCodes([1063, 1072, 1150, 1153, 1180, 1198, 1240, 1273]):
                return WeatherTypes.dayLightRain;
                break;

            case compareCodes([1168, 1186, 1189, 1201, 1243, 1276]):
                return WeatherTypes.dayMediumRain;
                break;

            case compareCodes([1087, 1171, 1192, 1195, 1246]):
                return WeatherTypes.dayHeavyRain;
                break;

            case compareCodes([1066, 1069, 1204, 1210, 1213, 1249, 1255, 1261, 1279]):
                return WeatherTypes.dayLightSnow;
                break;

            case compareCodes([1207, 1216, 1219, 1237, 1252, 1258, 1264, 1282]):
                return WeatherTypes.dayMediumSnow;
                break;

            case compareCodes([1114, 1117, 1222, 1225]):
                return WeatherTypes.dayHeavySnow;
                break;

            default:
                return WeatherTypes.dayClear;
        }
    }

    public setWeatherTypeAccuWeather(code: number): WeatherTypes {
        const timeOfDay = this.currentState.timeOfDay;

        function compareCodes(codes: any[]) {
            return codes.some(elem => code === elem);
        }

        // TODO: move codes arrays to public-api weather APIs codes
        switch (true) {
            case compareCodes([1, 2, 30, 31, 33, 34, 11]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
                break;

            case compareCodes([3, 4, 21, 35, 36]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
                break;

            case compareCodes([5, 6, 20, 32, 37]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
                break;

            case compareCodes([7, 8, 19, 38]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.dayHeavyClouds;
                break;

            case compareCodes([12, 13, 39]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
                break;

            case compareCodes([14, 18, 40]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
                break;

            case compareCodes([15, 16, 17, 41, 42]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
                break;

            case compareCodes([23]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
                break;

            case compareCodes([22, 24, 29, 26, 43]):
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
                break;

            case compareCodes([25, 44]):
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

    public setHoursForecast(hoursData): HoursForecast[] {
        return hoursData.map(hourData => {
            const weatherType: WeatherTypes = this.setWeatherTypeAccuWeather(hourData.WeatherIcon);
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
