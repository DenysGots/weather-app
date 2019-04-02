import { Injectable, ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

import { MoonPhases } from '../interfaces/public-api';

@Injectable()
export class HelpersService {
    constructor() { }

    // Taken from:
    // https://github.com/milosdjakonovic/requestAnimationFrame-polyfill/blob/master/rafPolyfill.js by milosdjakonovic
    // and https://gist.github.com/paulirish/1579671 by paulirish
    public setRequestAnimationFrame(): any {
        const vendors = ['ms', 'moz', 'webkit', 'o'];
        const FRAME_RATE_INTERVAL = 1000 / 60;
        const callbacksForCancellation = [];

        let allCallbacks = [];
        let executeAllScheduled = false;
        let shouldCheckCancelRaf = false;
        let customRequestAnimationFrame;
        let customCancelAnimationFrame;
        let customWindowAnimationFrame;

        const isToBeCancelled = function(cb) {
            for (let i = 0, length = callbacksForCancellation.length; i < length; i++) {
                if (callbacksForCancellation[i] === cb) {
                    callbacksForCancellation.splice(i, 1);
                    return true;
                }
            }
        };

        const executeAll = function() {
            executeAllScheduled = false;
            const _allCallbacks = allCallbacks;
            allCallbacks = [];

            for (let i = 0, length = _allCallbacks.length; i < length; i++) {
                if (shouldCheckCancelRaf) {
                    if (isToBeCancelled(_allCallbacks[i])) {
                        shouldCheckCancelRaf = false;
                        return;
                    }
                }

                _allCallbacks[i].apply(window, [ moment().valueOf() ]);
            }
        };

        const raf = function(callback) {
            allCallbacks.push(callback);

            if (!executeAllScheduled) {
                window.setTimeout(executeAll, FRAME_RATE_INTERVAL);
                executeAllScheduled = true;
            }

            return callback;
        };

        const cancelRaf = function(callback) {
            callbacksForCancellation.push(callback);
            shouldCheckCancelRaf = true;
        };

        for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        customRequestAnimationFrame = window.requestAnimationFrame ? window.requestAnimationFrame : raf;
        customCancelAnimationFrame = window.cancelAnimationFrame ? window.cancelAnimationFrame : cancelRaf;

        customWindowAnimationFrame = {
            customRequestAnimationFrame,
            customCancelAnimationFrame
        };

        return customWindowAnimationFrame;
    }

    // Taken from https://gist.github.com/endel/dfe6bb2fbe679781948c by endel and mrorigo
    public calculateMoonPhase(): MoonPhases {
        const phases = [
            'newMoon',
            'waxingCrescent',
            'waxingGibbous',
            'full',
            'waningGibbous',
            'waningCrescent',
        ];
        const currentDate = moment();
        const day = currentDate.day();

        let year = currentDate.year();
        let month = currentDate.month();

        if (month < 3) {
            year -= 1;
            month += 12;
        }

        month += 1;

        const c = 365.25 * year;
        const e = 30.6 * month;
        let jd = (c + e + day - 694039.09) / 29.5305882; // jd is total days elapsed, divided by the moon cycle
        let b = Math.trunc(jd); // int(jd) -> b, take integer part of jd
        jd -= b; // subtract integer part to leave fractional part of original jd
        b = Math.round(jd * 6); // scale fraction from 0-8 and round

        if (b >= 6) {
            b = 0;
        } // 0 and 8 are the same so turn 6 into 0

        return MoonPhases[phases[b]];
    }

    // Taken from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    public isStorageAvailable(type) {
        let storage;

        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                    e.code === 22 ||
                    e.code === 1014 ||
                    e.name === 'QuotaExceededError' ||
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
                ) &&
                (storage && storage.length !== 0);
        }
    }
}

// Taken from https://brianflove.com/2018/01/11/angular-window-provider by Brian Love
export const WINDOW = new InjectionToken('WindowToken');

export abstract class WindowRef {
    get nativeWindow(): Window | Object {
        throw new Error('Not implemented.');
    }
}

export class BrowserWindowRef extends WindowRef {
    constructor() {
        super();
    }

    get nativeWindow(): Window | Object {
        return window;
    }
}

export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: Object): Window | Object {
    if (isPlatformBrowser(platformId)) {
        return browserWindowRef.nativeWindow;
    }

    return {};
}

const browserWindowProvider: ClassProvider = {
    provide: WindowRef,
    useClass: BrowserWindowRef
};

const windowProvider: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [ WindowRef, PLATFORM_ID ]
};

export const WINDOW_PROVIDERS = [
    browserWindowProvider,
    windowProvider
];
