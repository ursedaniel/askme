import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from './routes/auth/guards/auth.guard';
// import {AuthGuardService} from './shared/services/auth-guard.service';

export const routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './routes/home/home.module#HomeModule'},
  {path: 'auth', loadChildren: './routes/auth/auth.module#AuthModule'},
  {path: 'stream', loadChildren: './routes/stream/stream.module#StreamModule', canActivate: [AuthGuard]},
  {path: 'ask', loadChildren: './routes/ask/ask.module#AskModule', canActivate: [AuthGuard]},
  {path: 'user', loadChildren: './routes/user/user.module#UserModule', canActivate: [AuthGuard]},
  {path: 'review', loadChildren: './routes/review/review.module#ReviewModule', canActivate: [AuthGuard]},

  // Not lazy-loaded routes
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // {path: 'recover', component: RecoverComponent},
  // {path: 'lock', component: LockComponent},
  // {path: 'maintenance', component: MaintenanceComponent},
  // {path: '404', component: Error404Component},
  // {path: '500', component: Error500Component},

  // Not found
  {path: '**', redirectTo: 'home', pathMatch: 'full'},

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
