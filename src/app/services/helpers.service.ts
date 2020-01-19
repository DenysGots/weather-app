import * as moment from 'moment';
import * as sunCalc from 'suncalc';

import {
  ClassProvider,
  FactoryProvider,
  Injectable,
  InjectionToken,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { MoonPhases } from '../../../shared/public-api';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
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

  // Taken from https://github.com/mourner/suncalc by mourner
  public calculateMoonPhase(): MoonPhases {
    const phases = [
      'newMoon',
      'waxingCrescent',
      'firstQuarter',
      'waxingGibbous',
      'full',
      'waningGibbous',
      'thirdQuarter',
      'waningCrescent'
    ];
    const phase = sunCalc.getMoonIllumination(moment()).phase;

    let phaseString;

    function phaseInRange(start: number, end: number): boolean {
      return phase >= start && phase < end;
    }

    switch (true) {
      case phaseInRange(0, 0.125):
        phaseString = MoonPhases[phases[0]];
        break;
      case phaseInRange(0.125, 0.25):
        phaseString = MoonPhases[phases[1]];
        break;
      case phaseInRange(0.25, 0.375):
        phaseString = MoonPhases[phases[2]];
        break;
      case phaseInRange(0.375, 0.5):
        phaseString = MoonPhases[phases[3]];
        break;
      case phaseInRange(0.5, 0.625):
        phaseString = MoonPhases[phases[4]];
        break;
      case phaseInRange(0.625, 0.75):
        phaseString = MoonPhases[phases[5]];
        break;
      case phaseInRange(0.75, 0.875):
        phaseString = MoonPhases[phases[6]];
        break;
      case phaseInRange(0.875, 1):
        phaseString = MoonPhases[phases[7]];
        break;
      default:
        phaseString = MoonPhases[phases[0]];
    }

    return phaseString;
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
  get nativeWindow(): Window | Object {
    return window;
  }
}

export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: Object): Window | Object {
  return isPlatformBrowser(platformId)
    ? browserWindowRef.nativeWindow
    : {};
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
