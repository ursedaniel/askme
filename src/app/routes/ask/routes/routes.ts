import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {CategoriesComponent} from '../components/categories/categories.component';
import {FindconnectionComponent} from "../components/findconnection/findconnection.component";
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: 'categories', component: CategoriesComponent},
  {path: 'connections', component: FindconnectionComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
