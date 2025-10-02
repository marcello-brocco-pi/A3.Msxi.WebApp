import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { UploadStatusNotifyDto, DocCubeHubMessageDto } from '../../../layout/models/upload-status-notify-dto.model';
import { ComponentBaseComponent } from '../../componentbase/component-base.component';
import { ModalMessageService } from '../../modal-message/modal-message.service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-remote-client-notify',
  imports: [CommonModule, TranslateModule, ToastModule, ProgressBar, ButtonModule],
  templateUrl: './remote-client-notify.component.html'
})

export class RemoteClientNotifyComponent extends ComponentBaseComponent implements OnInit {
  show: boolean = false;
  private tSubUpload?: Subscription;
  private tSubRemoteMsg?: Subscription;
  
  @Input() statusNotyfyDto:UploadStatusNotifyDto = { userId: 0, status: '', fileName: '', idLogGenFileManager: 0, companyId: 0, respMsg: '', isLoadPreview: false};
  showProgress: boolean = false;
  isOkToOpen: boolean = false;

  constructor(private router: Router,  private notificationService: NotificationService,private modalMessageService: ModalMessageService, 
    private messageService: MessageService,  translate: TranslateService) {
       super(translate);
    }
    
    
    override ngOnInit(): void {
      super.ngOnInit();
      this.tSubUpload = this.notificationService.subjRemoteUploadStatusNotify$.subscribe((statusNotyfyDto: UploadStatusNotifyDto) => {
        this.show = true;
        this.statusNotyfyDto = statusNotyfyDto;
        console.log('subjRemoteUploadStatusNotify$ changed:', this.show);
        this.updateStatus();
        // // Apre la preview dopo 2 secondi se il file è stato caricato correttamente
        // if(message.isLoadPreview){
        //     setTimeout(() => {
        //       this.gotoStorico(this.message.idLogGenFileManager);
        //     }, 2000);
        // }                
      });

      this.tSubRemoteMsg = this.notificationService.subjDocCubeHubMessage$.subscribe((message: DocCubeHubMessageDto) => {
        this.show = false;
        if(message.isRemoteError) {
          this.modalMessageService.showError(this.modalMessageService.defaultRemoteUploadErrorMessage() + message.description);
        }
      });

  }

  override applyTranslation(): void {

  }

  updateStatus() {
    this.isOkToOpen = false;
    this.messageService.clear();
    if(this.statusNotyfyDto.status === 'DA_ELABORARE'){
      this.showProgress = true;
      this.messageService.add({ severity: 'secondary', summary: this.translate.instant("Caricamento del file '{{fileName}}' in corso", { fileName: this.statusNotyfyDto.fileName }) + '...', detail: '', sticky: true });
    }
    else  if(this.statusNotyfyDto.status === 'IN_ELABORAZIONE'){
      this.showProgress = true;
      this.messageService.add({ severity: 'info', summary: this.translate.instant("Elaborazione del file '{{fileName}}' in corso", { fileName: this.statusNotyfyDto.fileName }) + '...', detail: '', sticky: true });
    }
    else  if(this.statusNotyfyDto.status === 'ELABORAZIONE_SALVATA'){
      this.showProgress = false;
      let m = this.translate.instant("File '{{fileName}}' salvato con successo", { fileName: this.statusNotyfyDto.fileName });
      if(this.statusNotyfyDto.isLoadPreview){
        this.isOkToOpen = true;
        m = this.translate.instant("File '{{fileName}}' elaborato con successo", { fileName: this.statusNotyfyDto.fileName });
      }
      this.messageService.add({ severity: 'success', summary: m, detail: '', sticky: true });
    }
    else  if(this.statusNotyfyDto.status === 'ELABORATO_CON_ERRORE'){
      this.showProgress = false;
      this.messageService.add({ severity: 'error', summary: this.translate.instant("Errore nell'elaborazione del file '{{fileName}}'", { fileName: this.statusNotyfyDto.fileName }), detail: '', sticky: true });
    }
  }

  override ngOnDestroy(): void {
    this.tSubUpload?.unsubscribe();
    this.tSubRemoteMsg?.unsubscribe();
  }

  gotoStorico(id: number) {
    this.show = false;
    sessionStorage.setItem('idLogGenFileManager', id.toString());
    this.statusNotyfyDto = { userId:0, status: '', fileName: '', idLogGenFileManager: 0, companyId: 0, respMsg: '', isLoadPreview: false};
    
    let url = `/importstatus`;
    if (this.router.url === url) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([url]);
      });
    }
    else{
      this.router.navigate([url]);
    }    
  }  

  onClose() {
      this.show = false;
  }
}
