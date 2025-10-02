import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { FileUploadStatus } from '../generic-file-upload/models/file-upload-status.enum';
import { FileUploadResultInfoItem } from '../generic-file-upload/models/fileUploadResultInfoItem.model';
import { GenericFileUploadDetailResponsePostDto } from '../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { LogSeverities } from '../generic-file-upload/models/logSeverities.enum.ts';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { GenImportStatusService } from '../generic-import-status/services/generic-import-status.service';

@Component({
  selector: 'app-generic-process-status',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, FluidModule, PanelModule, ProgressBarModule],
  templateUrl: './generic-process-status.component.html'
})
export class GenericProcessStatusComponent extends ComponentBaseComponent implements OnInit {
  @Input() pFileUploadDetailResponse: GenericFileUploadDetailResponsePostDto = {
    items: [], analysisResponse: '',
    isJsonPreview: null, jsonPreviewType: null, requestId: null, mappedJsonFinderFields: null, fileContentB64: null,
    remappedClassifierPages: null, uploadedFileName: null, lstAttachmentDto: null, contentResult: null, status: '',
    pagedMappedJsonFinderFields: null
  };
  @Input() pFileUploadProgressVisible: boolean = false;
  fileUploadStatusText: string = '';
  fileUploadMainIconClass: string = '';
  componentDisabled: string = '';
  analysisResponse: string = '';
  fileUploadStatus: FileUploadStatus = FileUploadStatus.NOT_UPLOADED;
  private tElaborazioneInCorso: string = '';
  private tImportTerminatoConErrori: string = '';
  private tImportTerminatoConAvvisi: string = '';
  private tImportTerminato: string = '';
  private tImportCancellatoDaUtente: string = '';

  constructor(translate : TranslateService, private importStatusService: GenImportStatusService, private chc: ChangeDetectorRef) { 
    super(translate);
    this.applyTranslation(); // Necessario in questa situazione
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override applyTranslation(): void {
    this.tElaborazioneInCorso = this.translate.instant('Elaborazione in corso');
    this.tImportTerminatoConErrori = this.translate.instant('Import terminato con errori.');
    this.tImportTerminatoConAvvisi = this.translate.instant('Import terminato con avvisi.');
    this.tImportTerminato = this.translate.instant('Import terminato.');
    this.tImportCancellatoDaUtente = this.translate.instant('Import cancellato da utente.');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pFileUploadProgressVisible']) {
      this.handleFileUploadResponse();
      this.chc.detectChanges();
    }
  }

  private handleFileUploadResponse() {
     setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 50);

    if (this.pFileUploadProgressVisible) {
      this.setUploadStatusUploading();
      return;
    }
  
    if (!this.pFileUploadDetailResponse.items) {
      this.setUploadStatusImportCompleted(LogSeverities.Error);
      return;
    }
       
  }

  private getFileUploadDetailItemStatusSummary(items: FileUploadResultInfoItem[]): LogSeverities {
    let result = LogSeverities.None;
    if (items) {
      if (items.filter(i => i.severity == LogSeverities.Error).length > 0) {
        result = LogSeverities.Error;
      }
      else if (items.filter(i => i.severity == LogSeverities.Warning).length > 0) {
        result = LogSeverities.Warning;
      }
      else if (items.filter(i => i.severity == LogSeverities.Cancelled).length > 0) {
        result = LogSeverities.Cancelled;
      }
      else if (items.filter(i => i.severity == LogSeverities.Info).length > 0) {
        result = LogSeverities.Info;
      }
      this.setUploadStatusImportCompleted(result);
    }
    return result;
  }

  public getFileUploadDetailItemStatusClass(item: FileUploadResultInfoItem): string {
    let result = '';
    if (item && item.severity) {
      switch (item.severity) {
        case LogSeverities.Error:
          result = this.importStatusService.getTagClassForState(2); // 2 = In errore
          break;
        case LogSeverities.Warning:
          result = this.importStatusService.getTagClassForState(3); // 3 = Elaborata con warning
          break;
        case LogSeverities.Cancelled:
          result = this.importStatusService.getTagClassForState(6); // 6 = Cancellata da utente
          break;
        case LogSeverities.Info:
          result = this.importStatusService.getTagClassForState(4); // 4 = Elaborata con successo
          break;
        case LogSeverities.Saved:
          result = this.importStatusService.getTagClassForState(7); // 7 = Salvata
          break;
        default:
          result = this.importStatusService.getTagClassForState(4); // ???
      }
    }
        
    return result;
  }

  getItems(items: FileUploadResultInfoItem[]): FileUploadResultInfoItem[] {
      let statusSummary = this.getFileUploadDetailItemStatusSummary(items);
      this.setUploadStatusImportCompleted(statusSummary);
      return items;
  }

  private setUploadStatusUploading() {
    this.fileUploadStatus = FileUploadStatus.UPLOADING;
    this.fileUploadStatusText = this.tElaborazioneInCorso + '...';
    this.fileUploadMainIconClass = 'pi pi-cloud-upload';
    this.componentDisabled = 'disabled';
    this.chc.detectChanges();
  }

  private setUploadStatusImportCompleted(status:LogSeverities) {
    this.fileUploadStatus = FileUploadStatus.UPLOAD_COMPLETED;

    this.fileUploadStatusText = this.translate.instant("File selezionati in accodamento per l'elaborazione");

    this.componentDisabled = 'disabled';
  }

  private setUploadStatusImportCompleted_Prev(status:LogSeverities) {
    this.fileUploadStatus = FileUploadStatus.UPLOAD_COMPLETED;

    switch (status) {
      case LogSeverities.Error:
          this.fileUploadStatusText = this.tImportTerminatoConErrori;
          break;
      case LogSeverities.Warning:
          this.fileUploadStatusText = this.tImportTerminatoConAvvisi;
          break;
      case LogSeverities.Info:
          this.fileUploadStatusText = this.tImportTerminato;
          break;
      case LogSeverities.Cancelled:
          this.fileUploadStatusText = this.tImportCancellatoDaUtente;
          break;
      case LogSeverities.None:
          this.fileUploadStatusText = this.tImportTerminato;
          break;
    }

    this.componentDisabled = 'disabled';
  }

}
