import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { EDonwloadFormat, LogTypeDto, LogTypes } from '../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { GenImportStatusService } from '../generic-import-status/services/generic-import-status.service';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { LogGenModalContentComponent } from "../generic-import-status/components/log-gen-modal-content/log-gen-modal-content.component";

@Component({
  selector: 'app-generic-dropdown-operation-log',
  standalone: true,
  imports: [CommonModule, TranslateModule, SelectModule, ButtonModule, LogGenModalContentComponent],
  templateUrl: './generic-dropdown-operation-log.component.html'
})

export class GenericDropdownOperationLogComponent extends ComponentBaseComponent {
  @Input() lstLogsDto: LogTypeDto[] | null = [];
  tAllegatoNonPresente: string = '';
  showLogDialog: boolean = false;
  idLog: number = 0;

  constructor(private modalMessageService: ModalMessageService, private generalUtilsService : GeneralUtilsService, 
        private importStatusService: GenImportStatusService, translate: TranslateService, private chc : ChangeDetectorRef) { 
    super(translate);
  }

  override applyTranslation(): void {
    this.tAllegatoNonPresente = this.translate.instant("Allegato non presente per la richiesta effettuata.");
    
  }
  
  execLogType(item: LogTypeDto) {
    if(item.logType === LogTypes.Operazioni){
      this.idLog = 0;
      this.showLogDialog = false;
      this.chc.detectChanges();
      this.showLogDialog = true;
      this.idLog = item.id;
    }
    else if(item.logType === LogTypes.Base64){
      this.importStatusService.downloadAttach(item.fileName, item.filePath, item.direction, EDonwloadFormat.Base64)
      .subscribe((response) => {
        this.saveAs(response);
      });
    }
    else if(item.logType === LogTypes.S3){
      this.importStatusService.downloadZippedDirS3(item.fileName)
      .subscribe((response) => {
        this.saveAs(response);
      });
    }
  }

  saveAs(response:any): void {
    if(response.body !== null){
      this.generalUtilsService.downloadBlobType(response.body, response.body.type, 
      this.generalUtilsService.getXFileNameFromRepsonse(response));
    }
    else{
      this.modalMessageService.showError(this.tAllegatoNonPresente)
    }
  }


}
