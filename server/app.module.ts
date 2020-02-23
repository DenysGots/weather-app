import { HttpModule, Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';

import { AppServerModule } from '../src/main.server';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { environment } from '../src/environments/environment';

// Angular SSR "window is not defined" error workaround, taken from https://github.com/angular/universal/issues/830#issuecomment-345228799
const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, '../', 'browser', 'index.html')).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;

((window as any).environment = environment);

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/universal-starter-v9/browser')
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class ApplicationModule {}
