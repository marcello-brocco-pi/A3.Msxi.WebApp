import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private auth : AuthService) {
        this.auth = auth;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //se l'utente è autenticato (interrogando il servizio di autenticazione), viene clonata la request e viene inserito l'header con il token rispettando la sintassi JWT
        //creando un header con Authorizazion: Bearer <token>
        request = request.clone({
            setHeaders: {
                'withCredentials': 'true',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'POST, GET, PATCH, PUT, DELETE'
            }
        });
        if (this.auth.isUserLoggedIn && this.auth.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.auth.token}`
                }
            });
        }
        return next.handle(request);
    }
}
