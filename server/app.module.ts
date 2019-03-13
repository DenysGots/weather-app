import {
    HttpModule,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { join } from 'path';
import { AngularUniversalModule, applyDomino } from '@nestjs/ng-universal';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppMiddleware } from './app.middleware';

const BROWSER_DIR = join(process.cwd(), 'dist/browser');
applyDomino(global, join(BROWSER_DIR, 'index.html'));

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            viewsPath: BROWSER_DIR,
            bundle: require('./../dist/server/main.js'),
        }),
        HttpModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class ApplicationModule /*implements NestModule*/ {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(AppMiddleware)
    //         .forRoutes({ path: 'weather', method: RequestMethod.GET });
    // }
}
