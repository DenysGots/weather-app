/* Interfaces */
export interface Parabola {
    a: number;
    b: number;
    c: number;
}

export interface CelestialData {
    celestial: CelestialPosition;
}

export interface CelestialPosition {
    x: string;
    y: string;
}

export interface WaterDrop {
    yPosition;
    xPosition;
    dropWidth;
    dropHeight;
    backgroundPosition;
    backgroundSize;
}

export interface WaterDropBorder {
    xPosition;
    yPosition;
    borderWidth;
    borderHeight;
}

export interface State {
    timeOfDay?: TimeOfDay; // day or night
    dayLength?: number; // milliseconds
    nightLength?: number; // milliseconds
    currentTime?: number; // milliseconds since midnight
    location?: string;
    currentTimeString?: string; // '19:00'
    currentDate?: string; // '5 Mar 2019'
    currentBackground?: string; // as a class to apply
    cloudy?: boolean;
    rainy?: boolean;
    snowy?: boolean;
    foggy?: boolean;
    overcast?: Overcast;
    weatherType?: WeatherTypes; // for icon generation
    weatherDefinition?: WeatherDefinitions; // as string
    temperatureCurrent?: number;
    temperatureFeelsLike?: number;
    humidityCurrent?: number;
    uvIndex?: number;
    airPressure?: number;
    windSpeed?: number;
    windDirection?: WindDirections; // for icon generation
    moonPhase?: MoonPhases; // for icon generation
    hoursForecast?: HoursForecast[];
    daysForecast?: DaysForecast[];
}

export interface HoursForecast {
    hourTime?: string; // '12:00'
    weatherTypeHour?: WeatherTypes; // for icon generation
    humidityCurrent?: number;
    temperatureCurrent?: number;
    windSpeedCurrent?: number;
    windDirectionCurrent?: WindDirections;
    uvIndexCurrent?: number;
}

export interface DaysForecast {
    dayDate?: string;  // '5 Mar'
    weatherTypeDay?: WeatherTypes; // for icon generation
    temperatureMin?: number;
    temperatureMax?: number;
    humidity?: number;
    uvIndex?: number;
}

export interface Position {
    longitude: number;
    latitude: number;
}

export interface Location {
    countryCode: string;
    country: string;
    city: string;
}

/* Enums */
export enum ButtonSizes {
    small = '15',
    medium = '30',
    big = '40',
}

export enum ButtonIconSizes {
    small = '10',
    medium = '14',
    big = '22',
}

export enum ButtonTypes {
    left = 'angle-left',
    right = 'angle-right',
    plus = 'plus',
    minus = 'minus',
    home = 'home',
}

export enum ButtonShapes {
    circle = 'circle',
    rectangle = 'rectangle',
}

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
    firstQuarter = 'wi-moon-alt-first-quarter',
    waxingGibbous = 'wi-moon-alt-waxing-gibbous-3',
    full = 'wi-moon-alt-full',
    waningGibbous = 'wi-moon-alt-waning-gibbous-4',
    thirdQuarter = 'wi-moon-alt-third-quarter',
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
export const spaceSm = 5;
export const spaceMd = 10;
export const sunSize = 36;
export const moonSize = 60;
export const cardsDeckHeight = 200;
export const cardWidth = 120;

/* Weather APIs data */
/* Apixu weather codes */
export const ApixuWeatherCodes = {
    dayClear: [1000],

    nightClear: [1000],

    fogCodes: [1030, 1135, 1147],

    cloudsCodes: {
        light: [1003],
        medium: [1006],
        heavy: [1009],
    },

    rainCodes: {
        light: [1063, 1072, 1150, 1153, 1180, 1198, 1240, 1273],
        medium: [1168, 1186, 1189, 1201, 1243, 1276],
        heavy: [1087, 1171, 1192, 1195, 1246],
    },

    snowCodes: {
        light: [1066, 1069, 1204, 1210, 1213, 1249, 1255, 1261, 1279],
        medium: [1207, 1216, 1219, 1237, 1252, 1258, 1264, 1282],
        heavy: [1114, 1117, 1222, 1225],
    },

    dayClearCodes: [1000, 1030, 1135, 1147],

    dayLightCloudsCodes: [1003],

    dayMediumCloudsCodes: [1006],

    dayHeavyCloudsCodes: [1009],

    dayLightRainCodes: [1063, 1072, 1150, 1153, 1180, 1198, 1240, 1273],

    dayMediumRainCodes: [1168, 1186, 1189, 1201, 1243, 1276],

    dayHeavyRainCodes: [1087, 1171, 1192, 1195, 1246],

    dayLightSnowCodes: [1066, 1069, 1204, 1210, 1213, 1249, 1255, 1261, 1279],

    dayMediumSnowCodes: [1207, 1216, 1219, 1237, 1252, 1258, 1264, 1282],

    dayHeavySnowCodes: [1114, 1117, 1222, 1225],

    1000: {
        day: 'Sunny',
        night: 'Clear',
    },

    1003: {
        day: 'Partly cloudy',
        night: 'Partly cloudy',
    },

    1006: {
        day: 'Cloudy',
        night: 'Cloudy',
    },

    1009: {
        day: 'Overcast',
        night: 'Overcast',
    },

    1030: {
        day: 'Mist',
        night: 'Mist',
    },

    1063: {
        day: 'Patchy rain possible',
        night: 'Patchy rain possible',
    },

    1066: {
        day: 'Patchy snow possible',
        night: 'Patchy snow possible',
    },

    1069: {
        day: 'Patchy sleet possible',
        night: 'Patchy sleet possible',
    },

    1072: {
        day: 'Patchy freezing drizzle possible',
        night: 'Patchy freezing drizzle possible',
    },

    1087: {
        day: 'Thundery outbreaks possible',
        night: 'Thundery outbreaks possible',
    },

    1114: {
        day: 'Blowing snow',
        night: 'Blowing snow',
    },

    1117: {
        day: 'Blizzard',
        night: 'Blizzard',
    },

    1135: {
        day: 'Fog',
        night: 'Fog',
    },

    1147: {
        day: 'Freezing fog',
        night: 'Freezing fog',
    },

    1150: {
        day: 'Patchy light drizzle',
        night: 'Patchy light drizzle',
    },

    1153: {
        day: 'Light drizzle',
        night: 'Light drizzle',
    },

    1168: {
        day: 'Freezing drizzle',
        night: 'Freezing drizzle',
    },

    1171: {
        day: 'Heavy freezing drizzle',
        night: 'Heavy freezing drizzle',
    },

    1180: {
        day: 'Patchy light rain',
        night: 'Patchy light rain',
    },

    1183: {
        day: 'Light rain',
        night: 'Light rain',
    },

    1186: {
        day: 'Moderate rain at times',
        night: 'Moderate rain at times',
    },

    1189: {
        day: 'Moderate rain',
        night: 'Moderate rain',
    },

    1192: {
        day: 'Heavy rain at times',
        night: 'Heavy rain at times',
    },

    1195: {
        day: 'Heavy rain',
        night: 'Heavy rain',
    },

    1198: {
        day: 'Light freezing rain',
        night: 'Light freezing rain',
    },

    1201: {
        day: 'Moderate or heavy freezing rain',
        night: 'Moderate or heavy freezing rain',
    },

    1204: {
        day: 'Light sleet',
        night: 'Light sleet',
    },

    1207: {
        day: 'Moderate or heavy sleet',
        night: 'Moderate or heavy sleet',
    },

    1210: {
        day: 'Patchy light snow',
        night: 'Patchy light snow',
    },

    1213: {
        day: 'Light snow',
        night: 'Light snow',
    },

    1216: {
        day: 'Patchy moderate snow',
        night: 'Patchy moderate snow',
    },

    1219: {
        day: 'Moderate snow',
        night: 'Moderate snow',
    },

    1222: {
        day: 'Patchy heavy snow',
        night: 'Patchy heavy snow',
    },

    1225: {
        day: 'Heavy snow',
        night: 'Heavy snow',
    },

    1237: {
        day: 'Ice pellets',
        night: 'Ice pellets',
    },

    1240: {
        day: 'Light rain shower',
        night: 'Light rain shower',
    },

    1243: {
        day: 'Moderate or heavy rain shower',
        night: 'Moderate or heavy rain shower',
    },

    1246: {
        day: 'Torrential rain shower',
        night: 'Torrential rain shower',
    },

    1249: {
        day: 'Light sleet showers',
        night: 'Light sleet showers',
    },

    1252: {
        day: 'Moderate or heavy sleet showers',
        night: 'Moderate or heavy sleet showers',
    },

    1255: {
        day: 'Light snow showers',
        night: 'Light snow showers',
    },

    1258: {
        day: 'Moderate or heavy snow showers',
        night: 'Moderate or heavy snow showers',
    },

    1261: {
        day: 'Light showers of ice pellets',
        night: 'Light showers of ice pellets',
    },

    1264: {
        day: 'Moderate or heavy showers of ice pellets',
        night: 'Moderate or heavy showers of ice pellets',
    },

    1273: {
        day: 'Patchy light rain with thunder',
        night: 'Patchy light rain with thunder',
    },

    1276: {
        day: 'Moderate or heavy rain with thunder',
        night: 'Moderate or heavy rain with thunder',
    },

    1279: {
        day: 'Patchy light snow with thunder',
        night: 'Patchy light snow with thunder',
    },

    1282: {
        day: 'Moderate or heavy snow with thunder',
        night: 'Moderate or heavy snow with thunder',
    },
};

/* AccuWeather icons codes */
export const AccuWeatherCodes = {
    dayClear: [1, 2, 30, 31],

    nightClear: [33, 34],

    fogCodes: [11],

    cloudsCodes: {
        light: [3, 4, 21, 35, 36],
        medium: [5, 6, 20, 32, 37],
        heavy: [7, 8, 19, 38],
    },

    rainCodes: {
        light: [12, 13, 39],
        medium: [14, 18, 40],
        heavy: [15, 16, 17, 41, 42],
    },

    snowCodes: {
        light: [23],
        medium: [22, 24, 29, 26, 43],
        heavy: [25, 44],
    },

    clearCodes: [1, 2, 30, 31, 33, 34, 11],

    lightCloudsCodes: [3, 4, 21, 35, 36],

    mediumCloudsCodes: [5, 6, 20, 32, 37],

    heavyCloudsCodes: [7, 8, 19, 38],

    lightRainCodes: [12, 13, 39],

    mediumRainCodes: [14, 18, 40],

    heavyRainCodes: [15, 16, 17, 41, 42],

    lightSnowCodes: [23],

    mediumSnowCodes: [22, 24, 29, 26, 43],

    heavySnowCodes: [25, 44],
};
