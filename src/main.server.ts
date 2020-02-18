import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

// (window as any).environment = environment;
//
// if (environment.production) {
//   enableProdMode();
// }

export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { AppServerModule } from './app/app.server.module';
