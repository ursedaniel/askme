import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MyprofileComponent} from '../components/myprofile/myprofile.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: 'account', component: MyprofileComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

