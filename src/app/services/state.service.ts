import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { HelpersService } from './helpers.service';

import {
    AccuWeatherCodes,
    ApixuWeatherCodes,
    DaysForecast,
    HoursForecast,
    Overcast,
    State,
    TimeOfDay,
    WeatherTypes,
    WindDirections,
} from '../interfaces/public-api';

@Injectable()
export class StateService {
    public currentState: State = <State>{};
    public locationData: any;

    constructor(private helpersService: HelpersService) { }

    // TODO: get from LocalStorage on init, if any, save to LocalStorage on receiving from server
    // public adjustReceivedData(weatherData: any): void {
    //
    //     /* TODO: move logic to server */
    //     this.currentState.currentTime = this.setCurrentTime();
    //     this.currentState.dayLength = this.setDayLength(weatherData[0].forecast.forecastday[0].astro);
    //     this.currentState.nightLength = this.setNightLength();
    //     this.currentState.timeOfDay = this.setTimeOfDay();
    //     this.currentState.humidityCurrent = weatherData[0].current.humidity;
    //     this.currentState.temperatureCurrent = weatherData[0].current.temp_c;
    //     this.currentState.temperatureFeelsLike = weatherData[0].current.feelslike_c;
    //     this.currentState.airPressure = Math.trunc(weatherData[0].current.pressure_mb / 1.333);
    //     this.currentState.uvIndex = weatherData[0].current.uv;
    //     this.currentState.windSpeed = weatherData[0].current.wind_kph;
    //     this.currentState.weatherDefinition = weatherData[0].current.condition.text;
    //     this.currentState.foggy = this.isFog(weatherData[0].current.condition.code);
    //     this.currentState.cloudy = this.isCloud(weatherData[0].current.condition.code);
    //     this.currentState.rainy = this.isRain(weatherData[0].current.condition.code);
    //     this.currentState.snowy = this.isSnow(weatherData[0].current.condition.code);
    //     this.currentState.weatherType = this.setWeatherTypeAccuWeather(weatherData[3][0].WeatherIcon, this.currentState.timeOfDay);
    //     this.currentState.windDirection = this.setWindDirection(weatherData[0].current.wind_degree);
    //     this.currentState.hoursForecast = this.setHoursForecast(weatherData[2]);
    //     this.currentState.daysForecast = this.setDaysForecast(weatherData[0].forecast.forecastday);
    //     /* */
    //
    //     this.currentState.location = this.setLocation();
    //     this.currentState.currentDate = this.setCurrentDate();
    //     this.currentState.currentTimeString = this.setCurrentTimeString();
    //     this.currentState.currentBackground = this.defineSkyBackground();
    //     this.currentState.moonPhase = this.helpersService.calculateMoonPhase();
    //
    //     console.log(this.currentState);
    // }

    public adjustReceivedData(weatherData: State): void {

        this.currentState = weatherData;
        this.currentState.location = this.setLocation();
        this.currentState.currentDate = this.setCurrentDate();
        this.currentState.currentTimeString = this.setCurrentTimeString();
        this.currentState.currentBackground = this.defineSkyBackground();
        this.currentState.moonPhase = this.helpersService.calculateMoonPhase();

        console.log(this.currentState);
    }

    /* TODO: move logic to server */
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

        this.currentState.overcast = Overcast.light;
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

    public setCurrentTime(time?: string): number {
        // TODO: after moving to server use time from currentInformation instead of moment()
        const currentTime: moment.Moment = time ? moment(time) : moment();
        const startOfDay: moment.Moment = moment().startOf('hour').hours(0);
        return moment.duration(currentTime.diff(startOfDay)).asMilliseconds();
    }

    public setTimeOfDay(date?: string): TimeOfDay {
        const currentHour: number = date
            ? moment.duration(this.setCurrentTime(date)).hours()
            : moment.duration(this.currentState.currentTime).hours();
        const dayHours: number = moment.duration(this.currentState.dayLength).hours();
        const nightHours: number = moment.duration(this.currentState.nightLength).hours();
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

    public setHoursForecast(hoursData): HoursForecast[] {
        return hoursData.map(hourData => {
            const timeOfDay: TimeOfDay = this.setTimeOfDay(hourData.DateTime);
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
    /* */

    public setLocation(): string {
        return `${this.locationData.geobytescapital}, ${this.locationData.geobytescountry}`;
    }

    public setCurrentDate(): string {
        return moment().format('D MMM YYYY');
    }

    public setCurrentTimeString(): string {
        return moment().format('HH:mm');
    }

    public defineSkyBackground(): string {
        // TODO: result must be emitted on change of current hour
        // TODO: gradient must change smoothly on a linear relationship as a function of time

        const currentHour: number = moment.duration(this.currentState.currentTime).hours();
        const shouldAdjustCurrentHour: boolean =
            this.currentState.dayLength / this.currentState.nightLength >= 1 ||
            currentHour === 0 ||
            currentHour === 12 ||
            currentHour === 24;

        let adjustedHour: number;
        let adjustedHourFormatted: string;

        adjustedHour = shouldAdjustCurrentHour
            ? currentHour
            : (currentHour < 12)
                ? (currentHour - 1)
                : (currentHour + 1);

        adjustedHourFormatted = moment().hour(adjustedHour).format('HH');
        return `app-sky-gradient-${adjustedHourFormatted}`;
    }

    public saveStateToLocalStorage(): void {
        if (this.helpersService.isStorageAvailable('localStorage')) {
            localStorage.setItem('lastSavedWeatherState', JSON.stringify(this.currentState));
        }
    }

    public getStateFromLocalStorage(): State {
        return (this.helpersService.isStorageAvailable('localStorage'))
            ? JSON.parse(localStorage.getItem('lastSavedWeatherState'))
            : this.currentState;
    }
}
