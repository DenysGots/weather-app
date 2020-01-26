import { MainPageComponent } from './components/main-page/main-page.component';

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: MainPageComponent
  }
];
