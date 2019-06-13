import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ReviewComponent} from "../components/review/review.component";
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: '', component: ReviewComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
