import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
    constructor(private translate : TranslateService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the current language from local storage or any other source
        const language = this.translate.currentLang || 'it';

        // Clone the request and set the new header in one step
        request = request.clone({
            setHeaders: {
                'Accept-Language': language
            }
        });

        return next.handle(request);
    }
}