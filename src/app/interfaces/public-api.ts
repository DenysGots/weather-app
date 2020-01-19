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
  borderWidth;
  borderHeight;
  backgroundPosition;
  backgroundSize;
}

export interface State {
  locationData?: Location;
  timeOfDay?: TimeOfDay;
  dayLength?: number;
  nightLength?: number;
  currentTime?: number;
  location?: string;
  currentTimeString?: string;
  currentDate?: string;
  currentBackground?: string;
  cloudy?: boolean;
  rainy?: boolean;
  snowy?: boolean;
  foggy?: boolean;
  overcast?: Overcast;
  weatherType?: WeatherTypes;
  weatherDefinition?: WeatherDefinitions;
  temperatureCurrent?: number;
  temperatureFeelsLike?: number;
  humidityCurrent?: number;
  uvIndex?: number;
  airPressure?: number;
  windSpeed?: number;
  windDirection?: WindDirections;
  moonPhase?: MoonPhases;
  hoursForecast?: HoursForecast[];
  daysForecast?: DaysForecast[];
}

export interface HoursForecast {
  hourTime?: string;
  weatherTypeHour?: WeatherTypes;
  humidityCurrent?: number;
  temperatureCurrent?: number;
  windSpeedCurrent?: number;
  windDirectionCurrent?: WindDirections;
  uvIndexCurrent?: number;
}

export interface DaysForecast {
  dayDate?: string;
  weatherTypeDay?: WeatherTypes;
  temperatureMin?: number;
  temperatureMax?: number;
  humidity?: number;
  uvIndex?: number;
}

export interface Location {
  countryCode: string;
  country: string;
  city: string;
}

/* Types */
export type ConfigFile = {
  usedHost?: string;
  noErrorsMode?: boolean;
};

/* Enums */
export enum ButtonSizes {
  small = '15',
  medium = '30',
  big = '40'
}

export enum ButtonIconSizes {
  small = '12',
  medium = '18',
  big = '26'
}

export enum ButtonTypes {
  left = 'angle-left',
  right = 'angle-right',
  up = 'angle-up',
  down = 'angle-down',
  home = 'home'
}

export enum ButtonShapes {
  circle = 'circle',
  rectangle = 'rectangle'
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
  nightHeavySnow = 'snowy-6'
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
  nightHeavySnow = 'Heavy snow'
}

export enum WindDirections {
  north = 'towards-0-deg',
  northEast = 'towards-45-deg',
  east = 'towards-90-deg',
  eastSouth = 'towards-135-deg',
  south = 'towards-180-deg',
  southWest = 'towards-225-deg',
  west = 'towards-270-deg',
  westNorth = 'towards-313-deg'
}

export enum MoonPhases {
  newMoon = 'wi-moon-alt-new',
  waxingCrescent = 'wi-moon-alt-waxing-crescent-4',
  firstQuarter = 'wi-moon-alt-first-quarter',
  waxingGibbous = 'wi-moon-alt-waxing-gibbous-3',
  full = 'wi-moon-alt-full',
  waningGibbous = 'wi-moon-alt-waning-gibbous-4',
  thirdQuarter = 'wi-moon-alt-third-quarter',
  waningCrescent = 'wi-moon-alt-waning-crescent-3'
}

export enum TimeOfDay {
  day = 'day',
  night = 'night'
}

export enum CardsDeckType {
  hours = 'hours',
  days = 'days'
}

export enum Overcast {
  light = 'light',
  medium = 'medium',
  heavy = 'heavy'
}

export enum NumberOfClouds {
  light = 4,
  medium = 8,
  heavy = 12
}

export enum NumberOfRainDrops {
  light = 200,
  medium = 450,
  heavy = 750
}

export enum NumberOfRainThroughDrops {
  light = 5,
  medium = 20,
  heavy = 50
}

export enum DropsOnScreen {
  light = 25,
  medium = 60,
  heavy = 100
}

export enum NumberOfSnowFlakes {
  light = 100,
  medium = 300,
  heavy = 500
}

export enum IconSizes {
  small = '12',
  medium = '14',
  extra = '18',
  big = '22',
  hero = '28',
  extra_big = '36'
}

export enum WeatherOptions {
  fog = 'fog',
  cloud = 'cloud',
  rain = 'rain',
  snow = 'snow'
}

export enum WeatherCodes {
  fogCodes = 'fogCodes',
  cloudsCodes = 'cloudsCodes',
  rainCodes = 'rainCodes',
  snowCodes = 'snowCodes'
}

/* Variables */
export const spaceSm = 5;
export const spaceMd = 10;
export const sunSize = 36;
export const moonSize = 60;
export const cardsDeckHeight = 200;
export const cardWidth = 120;

/* Weather APIs data */
/* Weatherbit weather codes */
export const WeatherbitWeatherCodes = {
  dayClear: [800],
  nightClear: [800],
  fogCodes: [700, 711, 721, 731, 741, 751],
  cloudsCodes: {
    light: [801, 802],
    medium: [803],
    heavy: [804]
  },
  rainCodes: {
    light: [200, 230, 300, 301, 500, 520],
    medium: [900, 201, 231, 302, 501, 511, 521],
    heavy: [202, 232, 233, 502, 522]
  },
  snowCodes: {
    light: [600, 611],
    medium: [601, 610, 612, 621],
    heavy: [602, 622, 623]
  },
  dayClearCodes: [800, 700, 711, 721, 731, 741, 751],
  dayLightCloudsCodes: [801, 802],
  dayMediumCloudsCodes: [803],
  dayHeavyCloudsCodes: [804],
  dayLightRainCodes: [200, 230, 300, 301, 500, 520],
  dayMediumRainCodes: [900, 201, 231, 302, 501, 511, 521],
  dayHeavyRainCodes: [202, 232, 233, 502, 522],
  dayLightSnowCodes: [600, 611],
  dayMediumSnowCodes: [601, 610, 612, 621],
  dayHeavySnowCodes: [602, 622, 623],
  200: {
    day: 'Thunderstorm with light rain',
    night: 'Thunderstorm with light rain'
  },
  201: {
    day: 'Thunderstorm with rain',
    night: 'Thunderstorm with rain'
  },
  202: {
    day: 'Thunderstorm with heavy rain',
    night: 'Thunderstorm with heavy rain'
  },
  230: {
    day: 'Thunderstorm with light drizzle',
    night: 'Thunderstorm with light drizzle'
  },
  231: {
    day: 'Thunderstorm with drizzle',
    night: 'Thunderstorm with drizzle'
  },
  232: {
    day: 'Thunderstorm with heavy drizzle',
    night: 'Thunderstorm with heavy drizzle'
  },
  233: {
    day: 'Thunderstorm with Hail',
    night: 'Thunderstorm with Hail'
  },
  300: {
    day: 'Light Drizzle',
    night: 'Light Drizzle'
  },
  301: {
    day: 'Drizzle',
    night: 'Drizzle'
  },
  302: {
    day: 'Heavy Drizzle',
    night: 'Heavy Drizzle'
  },
  500: {
    day: 'Light Rain',
    night: 'Light Rain'
  },
  501: {
    day: 'Moderate Rain',
    night: 'Moderate Rain'
  },
  502: {
    day: 'Heavy Rain',
    night: 'Heavy Rain'
  },
  511: {
    day: 'Freezing rain',
    night: 'Freezing rain'
  },
  520: {
    day: 'Light shower rain',
    night: 'Light shower rain'
  },
  521: {
    day: 'Shower rain',
    night: 'Shower rain'
  },
  522: {
    day: 'Heavy shower rain',
    night: 'Heavy shower rain'
  },
  600: {
    day: 'Light snow',
    night: 'Light snow'
  },
  601: {
    day: 'Snow',
    night: 'Snow'
  },
  602: {
    day: 'Heavy Snow',
    night: 'Heavy Snow'
  },
  610: {
    day: 'Mix snow/rain',
    night: 'Mix snow/rain'
  },
  611: {
    day: 'Sleet',
    night: 'Sleet'
  },
  612: {
    day: 'Heavy sleet',
    night: 'Heavy sleet'
  },
  621: {
    day: 'Snow shower',
    night: 'Snow shower'
  },
  622: {
    day: 'Heavy snow shower',
    night: 'Heavy snow shower'
  },
  623: {
    day: 'Flurries',
    night: 'Flurries'
  },
  700: {
    day: 'Mist',
    night: 'Mist'
  },
  711: {
    day: 'Smoke',
    night: 'Smoke'
  },
  721: {
    day: 'Haze',
    night: 'Haze'
  },
  731: {
    day: 'Sand/dust',
    night: 'Sand/dust'
  },
  741: {
    day: 'Fog',
    night: 'Fog'
  },
  751: {
    day: 'Freezing Fog',
    night: 'Freezing Fog'
  },
  800: {
    day: 'Sunny',
    night: 'Clear sky'
  },
  801: {
    day: 'Few clouds',
    night: 'Few clouds'
  },
  802: {
    day: 'Scattered clouds',
    night: 'Scattered clouds'
  },
  803: {
    day: 'Broken clouds',
    night: 'Broken clouds'
  },
  804: {
    day: 'Overcast clouds',
    night: 'Overcast clouds'
  },
  900: {
    day: 'Unknown Precipitation',
    night: 'Unknown Precipitation'
  }
};

/* AccuWeather icons codes */
export const AccuWeatherCodes = {
  dayClear: [1, 2, 30, 31],
  nightClear: [33, 34],
  fogCodes: [11],
  cloudsCodes: {
    light: [3, 4, 21, 35, 36],
    medium: [5, 6, 20, 32, 37],
    heavy: [7, 8, 19, 38]
  },
  rainCodes: {
    light: [12, 13, 39],
    medium: [14, 18, 40],
    heavy: [15, 16, 17, 41, 42]
  },
  snowCodes: {
    light: [23],
    medium: [22, 24, 29, 26, 43],
    heavy: [25, 44]
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
  heavySnowCodes: [25, 44]
};
