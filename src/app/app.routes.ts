import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {getHomeComponent} from "./utils/utils";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => getHomeComponent()
  },
  {
    path: 'home',
    redirectTo: '',
    loadComponent: () => getHomeComponent()
  }
];
