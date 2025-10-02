import { Routes } from '@angular/router';
import { Access } from './access.component';
import { Login } from './login.component';
import { Error } from './error.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login }
] as Routes;
