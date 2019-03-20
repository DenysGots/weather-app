import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
    AccuWeatherCodes,
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

// export interface State {
//     dayLength?: number;   // done
//     nightLength?: number;   // done
//     cloudy?: boolean;   // done
//     rainy?: boolean;   // done
//     snowy?: boolean;   // done
//     foggy?: boolean;   // done
//     overcast?: Overcast;   // done
//     weatherType?: WeatherTypes;   // done
//     weatherDefinition?: WeatherDefinitions;   // done
//     temperatureCurrent?: number;   // done
//     temperatureFeelsLike?: number;   // done
//     humidityCurrent?: number;   // done
//     uvIndex?: number;   // done
//     airPressure?: number;   // done
//     windSpeed?: number;   // done
//     windDirection?: WindDirections;
//     moonPhase?: MoonPhases;   // TODO: find api to import this
//
//     hoursForecast?: HoursForecast[];   // TODO
//     daysForecast?: DaysForecast[];   // TODO
// }

// export interface HoursForecast {
//     hourTime?: string; // '12:00' TODO: use Moment for generating this string
//     weatherType?: WeatherTypes; // for icon generation
//     humidityCurrent?: number;
//     temperatureCurrent?: number;
//     windSpeed?: number;
//     windDirection?: WindDirections;
//     airPressure?: number;
// }

// export interface DaysForecast {
//     dayDate?: string;  // '5 Mar' TODO: use Moment for generating this string
//     weatherType?: WeatherTypes; // for icon generation
//     temperatureMin?: number;
//     temperatureMax?: number;
//     humidityMin?: number;
//     humidityMax?: number;
// }

@Injectable()
export class StateService {
    public currentState: State = {
        overcast: Overcast.light,
        dayLength: 50400000,
        nightLength: 36000000,
        cloudy: false,
        rainy: false,
        snowy: false,
        foggy: false,
        weatherType: WeatherTypes.dayLightClouds,
        weatherDefinition: WeatherDefinitions.dayLightClouds,
        temperatureCurrent: 19,
        temperatureFeelsLike: 14,
        humidityCurrent: 5,
        windSpeed: 4.5,
        uvIndex: 3,
        airPressure: 745,
        windDirection: WindDirections.northEast,
        moonPhase: MoonPhases.waningCrescent,  // TODO: get this from some API
    };

    constructor() { }

    // TODO: move partly logic to server, copy interfaces to server
    public adjustReceivedData(weatherData: any): void {
        // TODO: transform received data into currentState

        this.currentState.dayLength = this.setDayLength(weatherData[0].forecast.forecastday[0].astro);
        this.currentState.nightLength = this.setNightLength();
        this.currentState.humidityCurrent = weatherData[0].current.humidity;
        this.currentState.temperatureCurrent = weatherData[0].current.temp_c;
        this.currentState.temperatureFeelsLike = weatherData[0].current.feelslike_c;
        this.currentState.airPressure = weatherData[0].current.pressure_mb / 1.333;
        this.currentState.uvIndex = weatherData[0].current.uv;
        this.currentState.windSpeed = weatherData[0].current.wind_kph;
        this.currentState.weatherDefinition = weatherData[0].current.condition.text;
        this.currentState.foggy = this.isFog(weatherData[0].current.condition.code);
        this.currentState.cloudy = this.isCloud(weatherData[0].current.condition.code);
        this.currentState.rainy = this.isRain(weatherData[0].current.condition.code);
        this.currentState.snowy = this.isSnow(weatherData[0].current.condition.code);
        this.currentState.timeOfDay = this.setTimeOfDay();
        this.currentState.weatherType = this.setWeatherTypeApixu(weatherData[0].current.condition.code);
        this.currentState.windDirection = this.setWindDirectionApixu(weatherData[0].current.wind_degree);
        this.currentState.moonPhase = this.setMoonPhase(); // TODO

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
        let sunRise = astroData.sunrise; // "06:04 AM"
        let sunSet = astroData.sunset; // "06:08 PM"

        sunRise = sunRise.split('');
        sunRise.splice(sunRise.indexOf(':'), 1);
        sunRise.splice(sunRise.indexOf(' '), 3);

        sunSet = sunSet.split('');
        sunSet.splice(sunSet.indexOf(':'), 1);
        sunSet.splice(sunSet.indexOf(' '), 3);

        sunRiseTime = moment().hours(sunRise.slice(0, 2).join('')).minutes(sunRise.slice(2, 2).join(''));
        sunSetTime = moment().hours(sunSet.slice(0, 2).join('')).minutes(sunSet.slice(2, 2).join(''));


        return moment.duration(sunSetTime.diff(sunRiseTime)).as('milliseconds');
    }

    public setNightLength(): number {
        return 86400000 - this.currentState.dayLength;
    }

    private setTimeOfDay(): TimeOfDay {
        const currentHour: number = moment.duration(this.currentState.currentTime).hours();
        const dayHours: number = moment.duration(this.currentState.dayLength).hours();
        const nightHours: number = moment.duration(this.currentState.nightLength).hours();
        const isNight: boolean = (currentHour <= nightHours / 2) || (currentHour >= dayHours + nightHours / 2);
        return isNight ? TimeOfDay.night : TimeOfDay.day;
    }

    public setWeatherTypeApixu(code): WeatherTypes {
        const timeOfDay = this.currentState.timeOfDay;

        switch (code) {
            case 1000 || 1030 || 1135 || 1147:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
                break;

            case 1003:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
                break;

            case 1006:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
                break;

            case 1009:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.dayHeavyClouds;
                break;

            case 1063 || 1072 || 1150 || 1153 || 1180 || 1198 || 1240 || 1273:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
                break;

            case 1168 || 1186 || 1189 || 1201 || 1243 || 1276:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
                break;

            case 1087 || 1171 || 1192 || 1195 || 1246:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
                break;

            case 1066 || 1069 || 1204 || 1210 || 1213 || 1249 || 1255 || 1261 || 1279:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
                break;

            case 1207 || 1216 || 1219 || 1237 || 1252 || 1258 || 1264 || 1282:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
                break;

            case 1114 || 1117 || 1222 || 1225:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavySnow : WeatherTypes.nightHeavySnow;
                break;

            default:
                return WeatherTypes.dayClear;
        }
    }

    public setWeatherTypeAccuWeather(code): WeatherTypes {
        const timeOfDay = this.currentState.timeOfDay;

        switch (code) {
            case 1 || 2 || 30 || 31 || 33 || 34 || 11:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayClear : WeatherTypes.nightClear;
                break;

            case 3 || 4 || 21 || 35 || 36:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightClouds : WeatherTypes.nightLightClouds;
                break;

            case 5 || 6 || 20 || 32 || 37:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumClouds : WeatherTypes.nightMediumClouds;
                break;

            case 7 || 8 || 19 || 38:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyClouds : WeatherTypes.dayHeavyClouds;
                break;

            case 12 || 13 || 39:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightRain : WeatherTypes.nightLightRain;
                break;

            case 14 || 18 || 40:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumRain : WeatherTypes.nightMediumRain;
                break;

            case 15 || 16 || 17 || 41 || 42:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavyRain : WeatherTypes.nightHeavyRain;
                break;

            case 23:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayLightSnow : WeatherTypes.nightLightSnow;
                break;

            case 22 || 24 || 29 || 26 || 43:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayMediumSnow : WeatherTypes.nightMediumSnow;
                break;

            case 25 || 44:
                return timeOfDay === TimeOfDay.day ? WeatherTypes.dayHeavySnow : WeatherTypes.nightHeavySnow;
                break;

            default:
                return WeatherTypes.dayClear;
        }
    }

    public setWindDirectionApixu(windAngle): WindDirections {
        // TODO
    }

    public setWindDirectionAccuWeather(windAngle): WindDirections {
        // TODO
    }

    public setMoonPhase(): MoonPhases {
        // TODO: apply as calculator, not API
    }

    public setHoursForecast(hoursData): HoursForecast[] {
        const hoursForecast: HoursForecast[];

        hoursForecast = hoursData.map(hourData => {
            const weatherType: WeatherTypes = this.setWeatherTypeAccuWeather(hourData.WeatherIcon);
            const windDirection: WindDirections = this.setWindDirectionAccuWeather(hourData.Wind.Direction.Degrees);

            return {
                hourTime: moment(hourData.DateTime).format('HH:MM'),
                weatherType: weatherType,
                humidityCurrent: hourData.RelativeHumidity,
                temperatureCurrent: hourData.Temperature.Value,
                windSpeed: hourData.Wind.Speed.Value,
                windDirection: windDirection,
                uvIndex: hourData.UVIndex,
            };
        });

        return hoursForecast;
    }

    public setDaysForecast(daysData): DaysForecast[] {
        // TODO
    }
}
