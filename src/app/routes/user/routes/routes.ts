import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MyprofileComponent} from '../components/myprofile/myprofile.component';
import {LogsComponent} from '../components/logs/logs.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: 'account', component: MyprofileComponent},
  {path: 'logs', component: LogsComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

