import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { ConfigFile } from './interfaces/public-api';

@Injectable({
  providedIn: 'root'
})
export class Config {
  static configFile: ConfigFile;

  constructor(protected http: HttpClient) {
    !((window as any).environment) && ((window as any).environment = environment);
  }

  async init() {
    return await import(`../config/config.${environment.config}.json`).then(
      configFile => (Config.configFile = configFile),
      error => console.error('Config not loaded', error)
    );
  }

  get backendUrl() {
    return Config.configFile.usedHost;
  }
}
