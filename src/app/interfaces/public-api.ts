export interface Parabola {
    a: number;
    b: number;
    c: number;
}

export interface CelestialPosition {
    x: string;
    y: string;
}

export enum TimeOfDay {
    day = 'day',
    night = 'night'
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

export const sunSize = 60;
export const moonSize = 60;
