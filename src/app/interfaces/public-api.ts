/* Interfaces */
export interface Parabola {
    a: number;
    b: number;
    c: number;
}

export interface CelestialPosition {
    x: string;
    y: string;
}

export interface State {
    /* TODO: move to weather state */
    cloudy?: boolean;
    rainy?: boolean;
    snowy?: boolean;
    foggy?: boolean;
    overcast?: Overcast;
    currentBackground?: string; // as class to apply
    /* */

    timeOfDay?: TimeOfDay; // day or night
    dayLength?: number; // milliseconds
    nightLength?: number; // milliseconds
    currentTime?: number; // milliseconds since midnight
    location?: string;
    currentTimeString?: string; // '19:00' TODO: use Moment for generating this string
    currentDate?: string; // '5 Mar 2019 TODO: use Moment for generating this string
}

export interface WeatherState {
    weatherType?: WeatherTypes;
    weatherDefinition?: WeatherDefinitions;
    temperatureCurrent?: number;
    temperatureFeelsLike?: number;
    temperatureMin?: number;
    temperatureMax?: number;
    humidityCurrent?: number;
    humidityMin?: number;
    humidityMax?: number;
    uvIndex?: number;
    airPressure?: number;
    windSpeed?: number;
    windDirection?: WindDirections;
    moonPhase?: MoonPhases;
}

export interface Location {
    longitude: number;
    latitude: number;
}

/* Enums */
export enum WeatherTypes {
    dayClear = 'day',
    dayLightClouds = 'cloudy-day-1',
    dayMediumClouds = 'cloudy-day-3',
    dayHeavyClouds = 'cloudy',
    dayLightRain = 'rainy-5',
    dayMediumRain = 'rainy-6',
    dayHeavyRain = 'thunder',
    dayLightSnow = 'snowy-4',
    dayMediumSnow = 'snowy-5',
    dayHeavySnow = 'snowy-6',
    nightClear = 'night',
    nightLightClouds = 'cloudy-night-1',
    nightMediumClouds = 'cloudy-night-3',
    nightHeavyClouds = 'cloudy',
    nightLightRain = 'rainy-5',
    nightMediumRain = 'rainy-6',
    nightHeavyRain = 'thunder',
    nightLightSnow = 'cloudy-4',
    nightMediumSnow = 'snowy-5',
    nightHeavySnow = 'snowy-6',
}

export enum WeatherDefinitions {
    dayClear = 'Clear sky',
    dayLightClouds = 'Partly cloudy',
    dayMediumClouds = 'Cloudy',
    dayHeavyClouds = 'Heavy clouds',
    dayLightRain = 'Light rain',
    dayMediumRain = 'Medium rain',
    dayHeavyRain = 'Heavy rain',
    dayLightSnow = 'Light snow',
    dayMediumSnow = 'Medium snow',
    dayHeavySnow = 'Heavy snow',
    nightClear = 'Clear sky',
    nightLightClouds = 'Partly cloudy',
    nightMediumClouds = 'Cloudy',
    nightHeavyClouds = 'Heavy clouds',
    nightLightRain = 'Light rain',
    nightMediumRain = 'Medium rain',
    nightHeavyRain = 'Heavy rain',
    nightLightSnow = 'Light snow',
    nightMediumSnow = 'Medium snow',
    nightHeavySnow = 'Heavy snow',
}

export enum WindDirections {
    north = 'towards-0-deg',
    northEast = 'towards-45-deg',
    east = 'towards-90-deg',
    eastSouth = 'towards-135-deg',
    south = 'towards-180-deg',
    southWest = 'towards-225-deg',
    west = 'towards-270-deg',
    westNorth = 'towards-313-deg',
}

export enum MoonPhases {
    newMoon = 'wi-moon-alt-new',
    waxingCrescent = 'wi-moon-alt-waxing-crescent-4',
    waxingGibbous = 'wi-moon-alt-waxing-gibbous-3',
    full = 'wi-moon-alt-full',
    waningGibbous = 'wi-moon-alt-waning-gibbous-4',
    waningCrescent = 'wi-moon-alt-waning-crescent-3',
}

export enum TimeOfDay {
    day = 'day',
    night = 'night'
}

export enum CardsDeckType {
    hours = 'hours',
    days = 'days',
}

export enum Overcast {
    light = 'light',
    medium = 'medium',
    heavy = 'heavy',
}

export enum NumberOfClouds {
    light = 4,
    medium = 8,
    heavy = 12,
}

export enum NumberOfRainDrops {
    light = 200,
    medium = 450,
    heavy = 750,
}

export enum NumberOfRainThroughDrops {
    light = 5,
    medium = 20,
    heavy = 50,
}

export enum DropsOnScreen {
    light = 25,
    medium = 60,
    heavy = 100,
}

export enum NumberOfSnowFlakes {
    light = 100,
    medium = 300,
    heavy = 500,
}

export enum IconSizes {
    small = '12',
    medium = '14',
    extra = '18',
    big = '22',
    hero = '28',
    extra_big = '36',
}

/* Variables */
export const spaceMd = 10;
export const sunSize = 36;
export const moonSize = 60;
export const cardsDeckHeight = 200;
export const cardWidth = 120;
