import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {PostsComponent} from '../components/posts/posts.component';
/**
 * Created by Daniel on 26.09.2017.
 */
const routes: Routes = [
  {path: '', component: PostsComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
