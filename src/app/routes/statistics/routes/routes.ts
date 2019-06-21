import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {StatisticsComponent} from "../components/statistics/statistics.component";
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: '', component: StatisticsComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

