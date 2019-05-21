import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {CategoriesComponent} from '../components/categories/categories.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: 'categories', component: CategoriesComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
