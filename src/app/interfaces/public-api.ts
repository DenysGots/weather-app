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
    cloudy?: boolean;
    rainy?: boolean;
    snowy?: boolean;
    foggy?: boolean;
    overcast?: Overcast;
    timeOfDay?: TimeOfDay; // day/night
    dayLength?: number; // milliseconds
    nightLength?: number; // milliseconds
    currentTime?: number; // milliseconds since midnight
    currentBackground?: string; // class
}

// TODO: add weather state, this one must be immutable, apart of by State service

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

export const spaceMd = 10;
export const sunSize = 36;
export const moonSize = 60;
export const cardsDeckHeight = 200;
export const cardWidth = 120;
