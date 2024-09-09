import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: 'login', pathMatch: 'full', loadChildren: () => AuthModule
  },
  { 
    path: '',redirectTo:'login', pathMatch:'full'
  },
  
  {
    path: 'sidebar',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
  },
  {
    path: '', redirectTo: '/sidebar/dashboard', pathMatch: 'full'
  },
  // Wildcard route for a 404 page
  { path: '**', redirectTo: '/sidebar/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
