import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export abstract class ServiceBaseService implements OnDestroy {

  public readonly BASE_URL = environment.MsxiApiUrl; 
  protected translate: TranslateService;
  private tSubscription?: Subscription;
  private tErrorServerOrCommunication: string = '';
  private tCodiceErrore: string = '';

  constructor(translate : TranslateService) { 
    this.translate = translate;
    this.applyTranslationBase();
    this.applyTranslation();
    

    this.tSubscription = this.translate.onLangChange.subscribe(() => {
        this.applyTranslationBase();
        this.applyTranslation();
    });
  }
  ngOnDestroy(): void {
    this.tSubscription?.unsubscribe();
  }

  protected abstract applyTranslation() : void ;

  protected applyTranslationBase() : void {
    this.tErrorServerOrCommunication = this.translate.instant('Errore server o nella comunicazione, riprovare più tardi.');
    this.tCodiceErrore = this.translate.instant('Codice errore');

  }
  
  public handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    const SERVER_OR_COMMUNICATION_ERROR = this.tErrorServerOrCommunication;
    if (err.error instanceof ErrorEvent) {
      //errore verificatosi lato client in javascript
      errorMessage = err.message;
    } else {
      //errore proveniente dal server
      if (err.status >= 400 && err.status < 500) {
        //errore tipo 400: gestisco tutti i possibili modi in cui il server potrebbe restituire l'errore e valorizzo la variabile errorMessage
        if (err.error != null) {
          if (typeof err.error != "object") {
            errorMessage = err.error;
          } else {
            if (err.error && err.error.errors) {
              errorMessage = '';
              for (const key in err.error.errors) {
                errorMessage += '-' + key + ": " + err.error.errors[key] + '<br/>';
              }
            } else {
              errorMessage = err.statusText;
            }

          }
        } else {
          errorMessage = err.message;
        }
      } else {
        //errore tipo 500: mostro un messaggio standard in quanto l'errore che invia il server potrebbe contenere informazioni che l'utente non deve visualizzare
        //come ad esempio numero di riga ecc. Queste informazioni saranno invece loggate sul server
        errorMessage = " - " + SERVER_OR_COMMUNICATION_ERROR;
        if(err?.error?.traceId) {
          errorMessage += `<BR/><BR/><span class="text-danger-emphasis fs-6">(${this.tCodiceErrore}: &nbsp; ${err.error.traceId})</span>`;
        }
      }
    }

    return throwError(() => errorMessage);
  }

}
