import { Injectable, ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';


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
}



/* Create a new injection token for injecting the window into a component. */
export const WINDOW = new InjectionToken('WindowToken');

/* Define abstract class for obtaining reference to the global window object. */
export abstract class WindowRef {

    get nativeWindow(): Window | Object {
        throw new Error('Not implemented.');
    }

}

/* Define class that implements the abstract class and returns the native window object. */
export class BrowserWindowRef extends WindowRef {

    constructor() {
        super();
    }

    get nativeWindow(): Window | Object {
        return window;
    }

}

/* Create an factory function that returns the native window object. */
export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: Object): Window | Object {
    if (isPlatformBrowser(platformId)) {
        return browserWindowRef.nativeWindow;
    }
    return new Object();
}

/* Create a injectable provider for the WindowRef token that uses the BrowserWindowRef class. */
const browserWindowProvider: ClassProvider = {
    provide: WindowRef,
    useClass: BrowserWindowRef
};

/* Create an injectable provider that uses the windowFactory function for returning the native window object. */
const windowProvider: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [ WindowRef, PLATFORM_ID ]
};

/* Create an array of providers. */
export const WINDOW_PROVIDERS = [
    browserWindowProvider,
    windowProvider
];
