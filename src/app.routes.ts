import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout.component';
import { Notfound } from './app/pages/notfound/notfound.component';
import { AuthGuard } from './app/core/guard/authguard.service';
import { Home } from './app/pages/home/components/home.component';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: Home },
            { path: 'statusprocesslist', 
                loadComponent: () => import('./app/pages/emailprocess/status-process-list/status-process-list-component.component')
                    .then(m => m.StatusProcessListComponentComponent) 
            },
            { path: 'emailprocessdetail/:id', 
                loadComponent: () => import('./app/pages/emailprocess/emailprocess-detail/emailprocess-detail.component')
                    .then(m => m.EmailprocessDetailComponent)
            },
            { path: 'changepassword', 
                loadComponent: () => import('./app/pages/user-profile/components/change-password/change-password.component')
                    .then(m => m.ChangePasswordComponent)
            }

        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
