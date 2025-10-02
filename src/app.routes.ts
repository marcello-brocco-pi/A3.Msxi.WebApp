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
            { path: 'fileupload', 
                loadComponent: () => import('./app/pages/generic/generic-file-upload/components/generic-file-upload-detail.component')
                    .then(m => m.GenericFileUploadDetail) 
            },
            { path: 'importstatus', 
                loadComponent: () => import('./app/pages/generic/generic-import-status/components/generic-import-status-list/generic-import-status-list.component')
                    .then(m => m.GenericImportStatus) 
            },
            { path: 'chatbotairag', 
                loadComponent: () => import('./app/pages/chat-bot-ai/chat-bot-ai-details/components/chat-bot-ai-details.component')
                    .then(m => m.ChatBotAiDetails) 
            },
            { path: 'consumptions', 
                loadComponent: () => import('./app/pages/reports/consumptions/components/consumptions-main/consumptions-main.component')
                    .then(m => m.ConsumptionsMainComponent) 
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
