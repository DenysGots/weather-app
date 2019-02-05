import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { DragulaModule } from 'ng2-dragula';
import { SharedModule } from './modules/shared/shared.module';
import { routes } from './app.routing';
import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

import { ButtonComponent } from './components/button/button.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { DayTimeDayViewComponent } from './components/day-time-day-view/day-time-day-view.component';
import { DayTimeNightViewComponent } from './components/day-time-night-view/day-time-night-view.component';
import { DayTimeWeatherViewComponent } from './components/day-time-weather-view/day-time-weather-view.component';
import { ForecastCardsDeckComponent } from './components/forecast-cards-deck/forecast-cards-deck.component';
import { ForecastCurrentInformationComponent } from './components/forecast-current-information/forecast-current-information.component';
import { ForecastWeatherCardComponent } from './components/forecast-weather-card/forecast-weather-card.component';
import { IconComponent } from './components/icon/icon.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { WeatherEffectCloudComponent } from './components/weather-effects/weather-effect-cloud/weather-effect-cloud.component';
import { WeatherEffectFogComponent } from './components/weather-effects/weather-effect-fog/weather-effect-fog.component';
import { WeatherEffectLightningComponent } from './components/weather-effects/weather-effect-lightning/weather-effect-lightning.component';
import { WeatherEffectLightning2Component } from './components/weather-effects/weather-effect-lightning2/weather-effect-lightning2.component';
import { WeatherEffectMoonComponent } from './components/weather-effects/weather-effect-moon/weather-effect-moon.component';
import { WeatherEffectRainComponent } from './components/weather-effects/weather-effect-rain/weather-effect-rain.component';
import { WeatherEffectSnowComponent } from './components/weather-effects/weather-effect-snow/weather-effect-snow.component';
import { WeatherEffectStarsComponent } from './components/weather-effects/weather-effect-stars/weather-effect-stars.component';
import { WeatherEffectSunComponent } from './components/weather-effects/weather-effect-sun/weather-effect-sun.component';
import { WeatherEffectWaterDropsComponent } from './components/weather-effects/weather-effect-water-drops/weather-effect-water-drops.component';
import { WeatherTypeCloudyComponent } from './components/weather-types/weather-type-cloudy/weather-type-cloudy.component';
import { WeatherTypeFoggyComponent } from './components/weather-types/weather-type-foggy/weather-type-foggy.component';
import { WeatherTypeRainyComponent } from './components/weather-types/weather-type-rainy/weather-type-rainy.component';
import { WeatherTypeSnowyComponent } from './components/weather-types/weather-type-snowy/weather-type-snowy.component';

import { WindowService } from './services/window/window.service';
import { WeatherEffectLightningService } from './services/weather-effect-lightning.service';

// For AoT compilation:
export function getWindow() {
    return window;
}

@NgModule({
    declarations: [
        AppComponent,
        ButtonComponent,
        ControlPanelComponent,
        DayTimeDayViewComponent,
        DayTimeNightViewComponent,
        DayTimeWeatherViewComponent,
        ForecastCardsDeckComponent,
        ForecastCurrentInformationComponent,
        ForecastWeatherCardComponent,
        IconComponent,
        MainPageComponent,
        WeatherEffectCloudComponent,
        WeatherEffectFogComponent,
        WeatherEffectLightningComponent,
        WeatherEffectLightning2Component,
        WeatherEffectMoonComponent,
        WeatherEffectRainComponent,
        WeatherEffectSnowComponent,
        WeatherEffectStarsComponent,
        WeatherEffectSunComponent,
        WeatherEffectWaterDropsComponent,
        WeatherTypeCloudyComponent,
        WeatherTypeFoggyComponent,
        WeatherTypeRainyComponent,
        WeatherTypeSnowyComponent,
    ],
    imports: [
        HttpClientModule,
        DragulaModule.forRoot(),
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on
        // the page.
        BrowserModule.withServerTransition({ appId: 'my-app' }),
        TransferHttpCacheModule,
        RouterModule.forRoot(routes, {
            useHash: false,
            preloadingStrategy: PreloadAllModules,
        }),
        SharedModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
    ],
    providers: [
        {
            provide: WindowService,
            useFactory: getWindow
        },
        WeatherEffectLightningService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        library.add(faAngleLeft, faAngleRight, faPlus, faMinus);
    }
}
