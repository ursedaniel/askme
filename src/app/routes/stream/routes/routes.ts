import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {StreamComponent} from '../components/stream/stream.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: '', component: StreamComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
