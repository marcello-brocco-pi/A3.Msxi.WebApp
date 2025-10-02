import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { JsonPreviewPostDto } from '../models/JsonPreviewPostDto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonFinderPagedValuesPreviewDto, JsonFinderValuesPreviewDto, PageDefPreviewDto, PdfViewerType, PreviewUpdateOptions, StylePreviewDto } from '../models/JsonFinderValuesPreviewDto.model';
import { GenericCodeJsonPanelComponent } from "../../generic-code-json-panel/generic-code-json-panel.component";
import { GenericProcessStatusComponent } from "../../generic-process-status/generic-process-status.component";
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, PageViewModeType, PDFPrintRange } from 'ngx-extended-pdf-viewer';
import { GenericJsonPreviewTypedInputComponent } from "../generic-json-preview-typed-input/generic-json-preview-typed-input.component";
import { SplitterModule } from 'primeng/splitter';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { ModalMessageService } from '../../../../shared/modal-message/modal-message.service';
import { JsonPreviewResponseDto, LogGenFileManagerAttachmentDto, GenericFileUploadDetailResponsePostDto, PreviewStateDto } from '../../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { DateUtilsService } from '../../shared/services/date-utils.service';
import { GenericJsonPreviewService } from '../services/generic-json-preview.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { EventEmitter, Output } from '@angular/core';
import { ModalMessageButtons } from '../../../../shared/modal-message/modal-message.enum';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FluidModule } from 'primeng/fluid';
import { GeneralUtilsService } from '../../../../shared/services/general-utils.service';
import {
  ImageViewerModule,
  ImageViewerComponent,
  CustomEvent,
  ToggleFullscreenDirective,
  ImageViewerConfig,
} from 'ngx-image-viewer-3';

@Component({
  selector: 'app-generic-json-finder-preview-modal',
  standalone: true,
  imports: [SplitterModule, ButtonModule,
            CommonModule, ProgressBarModule,
            FormsModule, FluidModule,
            GenericCodeJsonPanelComponent, 
            GenericProcessStatusComponent, 
            NgxExtendedPdfViewerModule, 
            GenericJsonPreviewTypedInputComponent,
            TranslateModule, DialogModule, PaginatorModule, ImageViewerModule],
  providers: [NgxExtendedPdfViewerService],
  templateUrl: './generic-json-finder-preview-modal.component.html'
})

export class GenericJsonFinderPreviewModalComponent extends ComponentBaseComponent implements OnInit, AfterViewInit{
  @Input() dataInput: JsonPreviewResponseDto;
  @Input() isOpenFromLog: boolean = false;
  @Input() visible: boolean = false;
  @Output() hidePreviewEvent = new EventEmitter<GenericFileUploadDetailResponsePostDto>();

  isUpdating: boolean = false;
  isCancelDisabled: boolean = true;
  uploadedFileName: string = '';
  showContent: string = '';
  lstAttachmentDto: LogGenFileManagerAttachmentDto[]|null = [];
  codeJson: any = null;
  dataOutput : JsonFinderValuesPreviewDto[] | null = [];
  dataOutputPaged: PageDefPreviewDto [] | null = []; 
  dataResponse: GenericFileUploadDetailResponsePostDto;
  fileUploadProgressVisible: boolean = false;
  fileUploadStatus: boolean = false;
  isShowheader: boolean = true;
  tNotConvertJson: string = '';
  tNo: string = '';
  tSi: string = '';
  pageViewerIdx: number = 1;
  isPagedPreview: boolean = false; // Flag to indicate if the preview is paged
  defViewMode: PageViewModeType = 'multiple';
  pageDataIdx : number = 0; // Index of the current page in the paged data
  pagerPageFirst: number = 0; // Start page for paginator
  pagerPageRows: unknown = 0; // Number of items per page
  pagerTotalRecords: number = 0; // Total number of pages in the paged
  isCloseFromExit: boolean = false; // Flag to indicate if the modal is closed from the exit button
  imageIndexOne = 0;
  imgViewerConfig: ImageViewerConfig = {};

  constructor( 
    private dateUtilsService: DateUtilsService,
    private modalMessageService: ModalMessageService,private printService: NgxExtendedPdfViewerService, 
    private cdr: ChangeDetectorRef, translate : TranslateService, private jsonPreviewService: GenericJsonPreviewService,
    private generalUtilsService: GeneralUtilsService) {
      super(translate);
      
      this.dataInput = {} as JsonPreviewResponseDto;
      this.dataResponse = {} as GenericFileUploadDetailResponsePostDto;
      this.imgViewerConfig = generalUtilsService.getImageViewerConfig();
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  onShow() {
    setTimeout(() => {
      this.isShowheader = true;
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }, 0);
    this.showContent = this.getContentB64() ?? '';
    this.uploadedFileName = this.dataInput.uploadedFileName ?? '';
    this.setupViewer(this.dataInput.pagedMappedJsonFinderFields);
  }

  setupViewer(data: JsonFinderPagedValuesPreviewDto | null) {
    setTimeout(() => {
        if(data?.isPagedPreview){
          this.isPagedPreview = true;
          this.defViewMode = this.getDefViewMode();
          this.pagerPageFirst = this.dataInput.pagedMappedJsonFinderFields!.pageFirst;
          this.pagerPageRows =  this.dataInput.pagedMappedJsonFinderFields!.pageRows;
          this.pagerTotalRecords = this.dataInput.pagedMappedJsonFinderFields!.totalRecords
          this.dataOutputPaged = this.dataInput.pagedMappedJsonFinderFields!.multiPagedDataDto;
        }
        else{
          this.dataOutput = this.dataInput.pagedMappedJsonFinderFields!.singlePageData;
        }
        this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }, 10);  
  }

  getDefViewMode(): PageViewModeType {
    if (this.dataInput.pagedMappedJsonFinderFields!.viewerType === PdfViewerType.SinglePage) {
      return 'single';
    } else {
      return 'multiple';
    }
  }

  getData() : any {
    if(!this.visible){
      return []; // If the modal is not visible, return an empty array
    }
    if(this.isPagedPreview){
      return this.dataOutputPaged![this.pageDataIdx].pageData; // Return the data for the current page
    }
    else{
      // If not paged, return the single page data directly
      return this.dataOutput
    }    
  }

  getPageTitle() : string {
    if(this.isPagedPreview){
      return this.dataOutputPaged![this.pageDataIdx].pageTitle; // Return the data for the current page
    }
    else{
      return '';
    }    
  }

  trackById(item: any): string {
    return item.rowId;
  }

  onHide() {
    if(this.isOpenFromLog && !this.isCloseFromExit){
        // Caso particolare per chiusura della modale da pulsante X
        // Bisogna patchare lo stato in salvato senza check e notifiche
        this.jsonPreviewService.closePreview(this.dataInput.requestId!).subscribe({
          next: (data: any) => {
            // Gestisci la risposta qui
          },
          error: (err: string) => {
            // Gestisci l'errore qui se necessario
          }
        });
    }
    this.dataOutputPaged = [];
    this.dataOutput = [];
    this.pageDataIdx = 0;
    this.pagerPageFirst = 0;
    this.pagerPageRows = 0;
    this.pagerTotalRecords = 0;
    this.isPagedPreview = false;
    this.pageViewerIdx = 1;
    this.isCloseFromExit = false;
    this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    setTimeout(() => {
      this.hidePreviewEvent.emit(this.dataResponse);
    }, 1000);
  }

  override applyTranslation(): void {
    this.tNotConvertJson = this.translate.instant("Non è stato possibile convertire il risultato in formato JSON:");
    this.tNo = this.translate.instant("No");
    this.tSi = this.translate.instant("Si");
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isShowheader = true;
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }, 0);
  }

  async updatePreview(status: number) {
    this.fileUploadProgressVisible = true;
    this.isUpdating = true;
    this.isCancelDisabled = true;
    this.scrollToBottom();
    this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    try {
      let request = {} as JsonPreviewPostDto;
      request.jsonPreviewStatus = status;
      request.requestId = this.dataInput.requestId ?? '';
      request.updateAnalysisResponse = '';
      request.jsonPreviewType = 'finder';

      if(status == PreviewUpdateOptions.wkfWithUpdate || status == PreviewUpdateOptions.savePreview){
        request.updateAnalysisResponse = JSON.stringify(this.isPagedPreview ? this.dataOutputPaged : this.dataOutput);
      }

      this.jsonPreviewService.updateJsonPreview(request).subscribe({
        next: (data: GenericFileUploadDetailResponsePostDto) => {

          this.dataResponse = data;          
          this.fileUploadProgressVisible = false;
          this.isCancelDisabled = false;

          if(data.contentResult !== null && data.contentResult.isReplacePreview){
            this.showContent = data.contentResult.contentB64 ?? '';
            if(data.contentResult.isOpenPrinter){
              setTimeout(() => {
                this.printService.print();
              }, 2000);
            }                 
          }
          
          if(this.isOpenFromLog){
            this.handleFileUploadResponse(data);
          }
          else{
             if(data.status === 'ELABORATO_CON_ERRORE'){
               this.close();
            }
          }
          this.scrollToBottom();
          this.cdr.detectChanges();
        },
        error: (err: string) => {
          this.fileUploadProgressVisible = false;
          this.isCancelDisabled = false;
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        }
      });

    } catch (err) {
      this.fileUploadProgressVisible = false;
      this.isCancelDisabled = false;
      this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
    }
  }

  scrollToBottom() {
    setTimeout(function (){
      const modalElement = document.querySelector('#bottomScroll');
      if (modalElement) {
        modalElement.scrollIntoView({behavior:"smooth", block: "end",inline: "nearest"});
      }
    }, 50);
  }

  private handleFileUploadResponse(data: GenericFileUploadDetailResponsePostDto) {
    if (data && data.analysisResponse) {
      try {
        this.codeJson = JSON.parse(data.analysisResponse);
        this.lstAttachmentDto = data.lstAttachmentDto;
      } catch (error) {
        this.codeJson = this.tNotConvertJson + ' ' + data.analysisResponse;
      }
    } else {
      this.codeJson = null;
    }
  }

  dateItaToIsoDateString(dateString: string): string | null {
    return this.dateUtilsService.dateItaToIsoDateString(dateString);
  }

  // formatValue(itemIdx: number) : string {
  //   //let item = this.dataInput.mappedJsonFinderFields![itemIdx];
  //   let item = this.dataInput.pagedMappedJsonFinderFields!.singlePageData[itemIdx];
  //   let value = item.prevValue;
  //   if(item.type == 'boolean'){
  //     let checkValue = (item.prevValue += '').toLowerCase();
  //     value = (checkValue === 'false' || checkValue === '') ? this.tNo : this.tSi;
  //   }
  //   else if(item.prevValue){
  //     if(item.type == 'decimal'){
  //       value = item.prevValue.replace('.', ',');
  //     }
  //     else if(item.type == 'date'){
  //       value = this.dateUtilsService.dateIsoToItaDateString(item.prevValue) ?? '';
  //     }    
  //   }
  //   return value;
  // }

  getTdWidth(width: string|null): string {
    return width ?? '';
  }

  setHeaderStyle(style: string|null) {
    if(style)
    {
      let formatStyle:StylePreviewDto = {} as StylePreviewDto;
      formatStyle = JSON.parse(style);
      if(formatStyle.tableStylePreviewDto?.showheader != null){
        this.isShowheader = formatStyle.tableStylePreviewDto.showheader;
      }
    }    
  }

  getShowRow(itemRow: JsonFinderValuesPreviewDto) : boolean {
    if(itemRow.visible != null){
      return !itemRow.visible;
    }
    else{
      return false;
    }
  }

  checkFormValid(): boolean {
    let ret = false;
    let fromData =  this.isPagedPreview ? this.dataOutputPaged![this.pageDataIdx].pageData : this.dataOutput
    if (Array.isArray(fromData)) {
      for (let i = 0; i < fromData.length; i++) {
        const item = fromData[i];
        if (item.type === 'cksssprioritystring') {
          //  && (item.newValue === null || item.newValue === '')
          ret = true;
          break; // Exit the loop
        }
        else if (item.required && (item.newValue === null || item.newValue === '')) {
          ret = true;
          break; // Exit the loop
        }
      }
    }
    return ret;
  }

  close() {    
    this.isCloseFromExit = true;
    this.isUpdating = false;
    this.isCancelDisabled = true;
    this.visible = false;
  }

  getImage() : string[] {
    return [this.getImgB64()];
  }

  getImgB64() : string {
    let conv = 'data:';
    let imgType = this.getImageType(this.uploadedFileName);
    if(imgType === 'image/tiff') {
      conv += 'image/png;base64,' +  this.generalUtilsService.convertTiffBase64ToPngBase64(this.showContent);  
    }
    else{
      conv += imgType + ';base64,' +  this.showContent;
    }
    return conv; // Update the showContent with the converted base64
  }

  isTextFile(fileName: string) : boolean {
    return this.generalUtilsService.isTextFile(fileName);
  }
 
  isImageFile(fileName: string) : boolean {
    return this.generalUtilsService.isImageFile(fileName);
  }

  getImageType(fileName: string): string {
    return this.generalUtilsService.getImageType(fileName);
  }

  isPdfFile(fileName: string) : boolean {
    return this.generalUtilsService.isPdfFile(fileName);
  }

  checkCanUpdatePreview(isConfirmUpdate:boolean) {
    if(this.isOpenFromLog){

      this.jsonPreviewService.getUpdateStatus(this.dataInput.requestId ?? '').subscribe({
            next: (data: PreviewStateDto) => {
              let msg = '';
              if (data.isClosed) {
                this.isCancelDisabled = false;
                msg = this.translate.instant("Il record selezionato è stato già elaborato dall'utente : {{user}}, in data : {{date}}.Non è possibile effettuare modifiche.", { user: data.lastUpdateUser, date: this.dateUtilsService.dateIsoToItaDateString(data.lastUpdateTs) });
                this.modalMessageService.showError(msg);
              }
              else if (!data.canPreview) {
                this.isCancelDisabled = false;
                msg = this.translate.instant("Il record selezionato risulta in elaborazione dall'utente : {{user}}, in data : {{date}}.Non è possibile effettuare modifiche.", { user: data.lastUpdateUser, date: this.dateUtilsService.dateIsoToItaDateString(data.lastUpdateTs) });
                this.modalMessageService.showError(msg);
              }
              else {
                this.confirmPreview(isConfirmUpdate);
              }
          },
          error: (err: string) => {
            this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
          }
        });
    }
    else{
      this.confirmPreview(isConfirmUpdate);
    }
  }

  confirmPreview(isConfirmUpdate:boolean){
    if(isConfirmUpdate){
      this.confirmUpdatePreview();
    }
    else{
      this.confirmClosePreview()
    }
  }

  confirmClosePreview() {
    let msg = this.translate.instant("Vuoi salvare i dati per una successiva elaborazione? (Si salva)(No/X annulla)");
    this.modalMessageService.showConfirm(msg, false, true)
    .subscribe((result: "accept" | "reject" | "cancel") => {
      this.scrollToBottom();
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
      if (result === "accept") {
        this.updatePreview(PreviewUpdateOptions.savePreview);
      }
      else if (result === "reject") {
        this.updatePreview(PreviewUpdateOptions.cancelPreview);
      }     
    }); 
  }

  confirmUpdatePreview() {
    let msg = this.translate.instant("Confermi l'operazione") + "?" ;
    this.modalMessageService.showConfirm(msg, false, true)
    .subscribe((result: "accept" | "reject" | "cancel") => {
      this.scrollToBottom();
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
      if (result === "accept") {
        this.updatePreview(PreviewUpdateOptions.wkfWithUpdate); 
      }
      else if (result === "reject") {
        
      }      
    }); 
  }

  onPageChange(event: PaginatorState) {
    this.pageDataIdx = event.page ?? 0;
    this.pagerPageFirst = event.first ?? 0;
    this.pagerPageRows = event.rows ?? 3;
    // Aggiorna la lista dei dati in base alla pagina corrente
    this.getData()
    if(this.dataInput.pagedMappedJsonFinderFields!.viewerType === PdfViewerType.SinglePage){
      this.pageViewerIdx = this.dataInput.pagedMappedJsonFinderFields!.multiPagedDataDto[this.pageDataIdx].pageViewerIdx
    }
    else{ // if(this.dataInput.pagedMappedJsonFinderFields!.viewerType === PdfViewerType.Sectioned){
      this.showContent = this.getContentB64() ?? '';
      this.pageViewerIdx = 0;
    }
    // alert('onPageChange: ' + event.first + ' - ' + event.rows + ' - ' + event.page);   
  }

  isShowPagingButtons(): boolean {
    return !(this.dataInput.pagedMappedJsonFinderFields!.viewerType === PdfViewerType.SinglePage)
  }

  getContentB64(): string|null|undefined {
    if(this.dataInput.pagedMappedJsonFinderFields!.viewerType === PdfViewerType.Sectioned){
      return this.dataInput.pagedMappedJsonFinderFields!.multiPagedDataDto[this.pageDataIdx].b64PageContent;
    }
    else{
      return this.dataInput.fileContentB64 ?? null;
    }      
  }

  getTextFromB64(b64Content: string) : string {
    let s = atob(b64Content).trim();// Decode the base64 content to text
    if(s.length === 0){
      return '';
    }
    return s; 
  }


}

