import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent} from '../components/home/home.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: '', component: HomeComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
