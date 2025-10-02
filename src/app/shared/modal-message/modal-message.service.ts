import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { ServiceBaseService } from '../services/service-base.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ModalMessageService extends ServiceBaseService {

    private tErrorDuringLastOperation!: string;
    private tErrorDuringUpload!: string;
    private tIntervalloDate!: string;
    private tErrato!: string;
    private tErrore!: string;
    private tSuccesso!: string;
    private tConferma!: string;

    constructor(translate: TranslateService, private confirmationService: ConfirmationService) {
        super(translate);

        this.applyTranslationBase();

    }

    protected override applyTranslation(): void {

        this.tErrorDuringLastOperation = this.translate.instant("Si è verificato un errore durante l'ultima operazione: <br/><br/>");
        this.tErrorDuringUpload = this.translate.instant("Si è verificato un errore durante l'ultima operazione di upload remoto: <br/><br/>");
        this.tIntervalloDate = this.translate.instant('Intervallo date');
        this.tErrato = this.translate.instant('errato');
        this.tErrore = this.translate.instant('Errore');
        this.tSuccesso = this.translate.instant('Successo');
        this.tConferma = this.translate.instant('Conferma');

    }

    public defaultErrorMessage(): string {
        return this.tErrorDuringLastOperation;
    }

    public defaultRemoteUploadErrorMessage(): string {
        return this.tErrorDuringUpload;
    }

    public dateRangeError(msg: string): string {
        return this.tIntervalloDate + ' ' + msg + ' ' + this.tErrato;
    }

    public showError(errorMessage: string): Observable<'accept' | 'reject' | 'cancel'> {
        const result = new Subject<'accept' | 'reject' | 'cancel'>();

        this.confirmationService.confirm({
            message: errorMessage,
            header: this.tErrore,
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-circle',
            acceptButtonProps: {
                label: this.translate.instant("Chiudi"),
            },
            acceptButtonStyleClass: 'w-24',
            rejectVisible: false,
            accept: () => result.next('accept'),
            reject: () => result.next('reject')
        });

        return result.asObservable();

    }
        
    public showSuccess(okMessage: string): Observable<'accept' | 'reject' | 'cancel'> {
        const result = new Subject<'accept' | 'reject' | 'cancel'>();

        this.confirmationService.confirm({
            message: okMessage,
            header: this.tSuccesso,
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-check-circle',
            acceptButtonProps: {
                label: this.translate.instant("Chiudi"),
            },
            acceptButtonStyleClass: 'w-24',
            rejectVisible: false,
            accept: () => result.next('accept'),
            reject: () => result.next('reject')
        });

        return result.asObservable();

    }

    public showConfirm(infoMessage: string, isCancel:boolean, isRejectVisible : boolean): Observable<'accept' | 'reject' | 'cancel'> {
        const result = new Subject<'accept' | 'reject' | 'cancel'>();
        let msg = '';
        if (isCancel) {
            msg = this.translate.instant('Annulla');
        }else{
            msg = this.translate.instant('No');
        }
        // p-dialog-close-button
        this.confirmationService.confirm({
            message: infoMessage,
            header: this.tConferma,
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-question-circle',
            acceptButtonProps: {
                label: 'Si'
            },
            rejectButtonProps: {
                label: msg,
                severity: 'secondary',
                outlined: true
            },
            acceptButtonStyleClass: 'w-24',
            rejectButtonStyleClass: 'w-24',
            rejectVisible: isRejectVisible,
            accept: () => result.next('accept'),
            reject: () => result.next('reject')
        });
        
        return result.asObservable();
    }

   

    // public showError(errorMessage: string): Observable<any> {
    //   let refModal = this.modalService.open(ModalMessageComponent, { size: 'xl', scrollable: true, centered: true, windowClass: 'z-index-10050', backdropClass: 'z-index-10000' });

    //   refModal.componentInstance.messageType = ModalMessageType.ERROR;
    //   refModal.componentInstance.messageText = errorMessage;
    //   refModal.componentInstance.messageTitle = this.tErrore;

    //   return from(refModal.result);
    // }


    // public showConfirm(infoMessage: string, defaultButton: ModalMessageButtons | null = null): Observable<boolean> {
    //   let refModal = this.modalService.open(ModalMessageComponent, { size: 'xl', scrollable: true, centered: true, windowClass: 'z-index-10050', backdropClass: 'z-index-10000' });

    //   refModal.componentInstance.messageType = ModalMessageType.QUESTION;
    //   refModal.componentInstance.messageText = infoMessage;
    //   refModal.componentInstance.messageTitle = this.tConferma;
    //   refModal.componentInstance.defaultButton = defaultButton;

    //   return from(refModal.result);

    // }

}
