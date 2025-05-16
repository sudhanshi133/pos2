import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'operator',
        loadChildren: () => import('./operator/operator.module').then(m => m.OperatorModule)
    },
    {
        path: 'supervisor',
        loadChildren: () => import('./supervisor/supervisor.module').then(m => m.SupervisorModule)
    },
    {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
    }
]; 