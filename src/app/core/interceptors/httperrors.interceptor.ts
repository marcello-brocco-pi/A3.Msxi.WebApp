import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
    auth: AuthService;
    private tErrorePermessi = '';

    constructor(auth : AuthService, private translate: TranslateService) {
        this.auth = auth;
        this.applyTranslation();
        this.translate.onLangChange.subscribe(() => {
            this.applyTranslation();
        });
    }

    private applyTranslation() {
        this.tErrorePermessi = this.translate.instant("Non si dispone dei permessi per accedere alla funzionalità richiesta.");
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err =>{
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.auth.logOut();
                location.reload();
            } else if (err.status === 403) {
                err.message= this.tErrorePermessi;
            }
            return throwError(() => err);
        }));
    }
}

