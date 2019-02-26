import {
    Injectable,
    OnInit,
} from '@angular/core';

import { Overcast, State, TimeOfDay } from '../interfaces/public-api';

@Injectable()
export class StateService implements OnInit {
    // public overcast: Overcast = Overcast.light;
    // public timeOfDay: TimeOfDay/* = TimeOfDay.night*/;
    //
    // public dayLength: number = 50400000; // 14 hours in milliseconds
    // public nightLength: number = 36000000; // 10 hours in milliseconds
    // public currentTime: number; // milliseconds since midnight
    //
    // public cloudy: boolean = false;
    // public rainy: boolean = true;
    // public snowy: boolean = false;
    // public foggy: boolean = false;
    //
    // public currentBackground: string;

    public currentState: State = {
        overcast: Overcast.light,
        dayLength: 50400000,
        nightLength: 36000000,
        cloudy: false,
        rainy: true,
        snowy: false,
        foggy: false,
    };

    constructor() { }

    ngOnInit () { }
}
