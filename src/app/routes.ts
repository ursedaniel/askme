import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
// import {AuthGuardService} from './shared/services/auth-guard.service';

export const routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './routes/home/home.module#HomeModule'},
  // {path: 'login', loadChildren: './routes/login/login.module#LoginModule'},
  // {path: 'register', loadChildren: './routes/register/register.module#RegisterModule'},
  // {path: 'account', loadChildren: './routes/account/account.module#AccountModule',  canActivate: [AuthGuardService]},

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
