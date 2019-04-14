import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
} from '@angular/material';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleLeft,
    faAngleRight,
    faPlus,
    faMinus,
    faHome,
} from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { SharedModule } from './modules/shared/shared.module';

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
import { WeatherEffectMoonComponent } from './components/weather-effects/weather-effect-moon/weather-effect-moon.component';
import { WeatherEffectRainComponent } from './components/weather-effects/weather-effect-rain/weather-effect-rain.component';
import { WeatherEffectSnowComponent } from './components/weather-effects/weather-effect-snow/weather-effect-snow.component';
import { WeatherEffectStarsComponent } from './components/weather-effects/weather-effect-stars/weather-effect-stars.component';
import { WeatherEffectSunComponent } from './components/weather-effects/weather-effect-sun/weather-effect-sun.component';
import { WeatherEffectWaterDropsComponent } from './components/weather-effects/weather-effect-water-drops/weather-effect-water-drops.component';

import { NumberToIterablePipe } from './pipes/numberToIterable.pipe';
import { TemperatureValuePipe } from './pipes/temperatureValuePipe.pipe';

import { WINDOW_PROVIDERS } from './services/helpers.service';

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
        NumberToIterablePipe,
        TemperatureValuePipe,
        WeatherEffectCloudComponent,
        WeatherEffectFogComponent,
        WeatherEffectLightningComponent,
        WeatherEffectMoonComponent,
        WeatherEffectRainComponent,
        WeatherEffectSnowComponent,
        WeatherEffectStarsComponent,
        WeatherEffectSunComponent,
        WeatherEffectWaterDropsComponent,
    ],
    imports: [
        HttpClientModule,
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
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        MatButtonModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatRadioModule,
        MatSliderModule,
        MatSlideToggleModule,
    ],
    providers: [
        WINDOW_PROVIDERS,
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
    constructor() {
        library.add(
            faAngleLeft,
            faAngleRight,
            faPlus,
            faMinus,
            faHome
        );
    }
}
