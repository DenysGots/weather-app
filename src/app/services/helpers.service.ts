import { Injectable } from '@angular/core';
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
