import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';
import { OperatoreDto } from '../../models/OperatoreDto.model';
import { EsitoDto } from '../../models/EsitoDto.model';
import { Categoria } from '../../models/Categorie.model';
import { ImportStatusDto } from '../../models/ImportStatusDto.model';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FldRageFromTo } from '../../../generic-file-upload/models/dynamicFormControlInfo.model';
import { CatConfigurationDto, FieldInfoValuesDto } from '../../../generic-file-upload/models/categoriaDto.model';
import { ActivatedRoute } from '@angular/router';
import { GenImportStatusService } from '../../services/generic-import-status.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { ImportStatusFilterResponseGetDto } from '../../models/ImportStatusFilterResponseGetDto.models';
import { DynamicFieldInfoValueDto, DynamicFilterFieldInfoValueDto } from '../../../../../core/models/dynamic-fieid-info-value-dto.model';
import { ImportStatusRequestGetDto } from '../../models/ImportStatusRequestGetDto.model';
import { ImportStatusResponseGetDto } from '../../models/ImportStatusResponseGetDto.model';
import { ModalMessageService } from '../../../../../shared/modal-message/modal-message.service';
import { DataTableInfo } from '../../../shared/models/DataTableModels/data-table-info';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { CommonModule, formatCurrency, formatDate, formatNumber } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { GeneralUtilsService } from '../../../../../shared/services/general-utils.service';
import { FieldInfoDto } from '../../../generic-file-upload/models/fieldInfoDto.model.ts';
import { Table, TableLazyLoadEvent, TableModule, TablePageEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeNG } from 'primeng/config';
import { GenericDropdownUploadedFilesComponent } from "../../../generic-dropdown-uploaded-files/generic-dropdown-uploaded-files.component";
import { GenericDropdownOperationLogComponent } from "../../../generic-dropdown-operation-log/generic-dropdown-operation-log.component";
import { GenericFileUploadDetailResponsePostDto, JsonPreviewResponseDto, LogTypeDto, LogTypes, PreviewStateDto } from '../../../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { GenericJsonFinderPreviewModalComponent } from "../../../generic-json-preview/generic-json-finder-preview-modal/generic-json-finder-preview-modal.component";
import { GenericJsonPreviewService } from '../../../generic-json-preview/services/generic-json-preview.service';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
    selector: 'app-generif-import-status',
    standalone: true,
    imports: [FormsModule, AccordionModule, ToggleSwitchModule, DatePickerModule, TranslateModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, InputIconModule,
    GenericDropdownUploadedFilesComponent, GenericDropdownOperationLogComponent, Tag, GenericJsonFinderPreviewModalComponent, ToggleButtonModule],
    templateUrl: './generic-import-status-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GenericImportStatus extends ComponentBaseComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  
  showFinderPreview: boolean = false;
  operatori: OperatoreDto[] = [];
  esiti: EsitoDto[] = [];
  categorie: Categoria[] = [];
  catConfigurationDto: CatConfigurationDto | null = null;
  importStatusItems: ImportStatusDto[] = [];
  localeCalendar: any;
  TypeTitle : string | null = null;
  CategoryTitle : string | null = null;
  activeMetricsTab = 1;
  categorieSubscription: Subscription | null = null;
  dynamicFieldsFormControls: FldRageFromTo[] = [];
  importStatusFilterForm: FormGroup | null = null

  cataloghiList: FieldInfoValuesDto[] = [];
  thModel: FieldInfoValuesDto[] = [];
  idThToDisable: string | null = null;
  idFieldInfoValueGroupsSelected:number = 0;
  formatter = (x: {description: string}) => x.description;

  operatoriFilterEnabled: boolean = false;
  selectedConfig: string = '';
  isConfigSelected: boolean = false;
  showSearchRawTextAttach: boolean = false;

  isLoading: boolean = false;
  tAziendaNonRecuperata: string = '';
  tInserimento: string = '';
  tIntervalloValori: string = '';
  tErrato: string = '';
  tCategoria: string = '';
  tImportDocumento: string = '';
  dataTableInfo: DataTableInfo = new DataTableInfo();
  totalRecords: number = 0;
  isLoadingTable: boolean = false;
  expandedRows = {};
  expanded: boolean = false;
  dataInput: JsonPreviewResponseDto = {
        requestId: null,
        mappedJsonFinderFields: null,
        remappedClassifierPages: null,
        jsonPreviewType: null,
        fileContentB64: '',
        uploadedFileName: '',
        pagedMappedJsonFinderFields: null
    };
  pageRows: number = 5;
  isAutoRefresh: boolean = false;
  autorefreshCounter: number = 0;
  dataSaveStatusFilters: ImportStatusFilterResponseGetDto | null = null;


  constructor(private importStatusService: GenImportStatusService,  private route: ActivatedRoute,translate : TranslateService,
      private auth : AuthService, private modalMessageService : ModalMessageService,  private dateUtilsService: DateUtilsService,
      private generalUtilsService : GeneralUtilsService, private cdr: ChangeDetectorRef, primeNGConfig: PrimeNG,
      private jsonPreviewService: GenericJsonPreviewService) {
      super(translate, primeNGConfig);
      this.applyTranslation();
  }

  protected override applyTranslation(): void {
      this.tAziendaNonRecuperata = this.translate.instant("Azienda non recuperata");
      this.tInserimento = this.translate.instant("Inserimento");
      this.tIntervalloValori = this.translate.instant("Intervallo valori");
      this.tErrato = this.translate.instant("errato");
      this.tCategoria = this.translate.instant("Categoria");
      this.tImportDocumento = this.translate.instant("Import documento");
      this.TypeTitle = this.tImportDocumento;
      this.CategoryTitle = this.tCategoria;
  }
  
  get selConfigPropName() {
      return this.importStatusFilterForm?.get('selConfigPropName');
  }

  get selConfigPropValue() {
      return this.importStatusFilterForm?.get('selConfigPropValue');
  }

  get responseLike() {
      return this.importStatusFilterForm?.get('responseLike');
  }

  get rawTextLike() {
      return this.importStatusFilterForm?.get('rawTextLike');
  }

  get operatore() {
      return this.importStatusFilterForm?.get('operatore');
  }

  get operatoreObj() {
      return this.importStatusFilterForm?.get('operatoreObj');
  }

  get dataInsDa() {
      return this.importStatusFilterForm?.get('dataInsDa');
  }

  get dataInsA() {
      return this.importStatusFilterForm?.get('dataInsA');
  }

  get esito() {
      return this.importStatusFilterForm?.get('esito');
  }

  get esitoObj() {
      return this.importStatusFilterForm?.get('esitoObj');
  }

  get categoria() {
      return this.importStatusFilterForm?.get('categoria');
  }
  get categoriaObj() {
      return this.importStatusFilterForm?.get('categoriaObj');
  }
  get nomeAllegato() {
      return this.importStatusFilterForm?.get('nomeAllegato');
  }
  
  override ngOnInit() {
      super.ngOnInit();  
      this.createFilterForm();
      this.onFileUploadFormChanges();
      this.loadData();
  }

  private createFilterForm() {
      this.importStatusFilterForm = new FormGroup({
          operatore: new FormControl<number | null>(null),
          operatoreObj: new FormControl<any | null>(null),
          dataInsDa: new FormControl<Date | null>(null),
          dataInsA: new FormControl<Date | null>(null),
          esito: new FormControl<number | null>(null),
          esitoObj: new FormControl<any | null>(null),
          categoria: new FormControl<number | null>(null),
          categoriaObj: new FormControl<any | null>(null),
          nomeAllegato: new FormControl<string | null>(null),
          selConfigPropName: new FormControl<string | null>(null),
          selConfigPropValue: new FormControl<string | null>(null),
          responseLike: new FormControl<string | null>(null),
          rawTextLike: new FormControl<string | null>(null)
      });
  }

  onFileUploadFormChanges(): void {
      if (!this.categorieSubscription) {
          this.categorieSubscription = this.categoria?.valueChanges.subscribe(val => {
              this.isLoading = true;
              this.dynamicFieldsFormControls = [];
              setTimeout(() =>{
                this.fillDynamicFilterFieldsFormControls(val);
                this.isLoading = false;
                this.changeSelOperatore();
              },10);
          }) as Subscription | null;
      }
  }
  
  fillDynamicFilterFieldsFormControls(id:number) {
    this.catConfigurationDto = null;
    this.resetCustomFilter();
    this.categorie.filter(x => x.id === id).forEach(cat => {
    if(cat.configuration){
      this.catConfigurationDto = JSON.parse(cat.configuration) as CatConfigurationDto;
      if(this.catConfigurationDto && this.catConfigurationDto.customFilterFields && this.catConfigurationDto.customFilterFields.length > 0){
        this.catConfigurationDto.customFilterFields.unshift({ key: null, value: this.translate.instant("Seleziona") });
      }
    }
    this.showSearchRawTextAttach = cat.showSearchRawTextAttach;
    cat.fields.forEach(fi => {
      let newFormControlNameFrom = this.getFldName(fi, false);
      let newFormControlNameTo = '';
      let newFormControl: FormControl | null = null;
      let newFormControlTo: FormControl | null = null;
      
      switch (fi.type) {
          case 'decimal':
          case 'integer':
          case 'currency':
            newFormControl = new FormControl<number | null>(null);
            newFormControlTo = new FormControl<number | null>(null);
            newFormControlNameTo  = this.getFldName(fi, true);
            break;
          case 'typeahead':
            newFormControl = new FormControl<FieldInfoValuesDto[] | null>(null);
            break;
          case 'dropdown':
          case 'string':
            newFormControl = new FormControl<string | null>(null);
            break;
          case 'date':
          case 'datetime':
            newFormControl = new FormControl<Date | null>(null);
            newFormControlTo = new FormControl<number | null>(null);
            newFormControlNameTo  = this.getFldName(fi, true);
            break;
          case 'boolean':
            newFormControl = new FormControl<boolean | null>(null);
            break;
          default:
            break;
        }
       
        this.dynamicFieldsFormControls.push({ key: newFormControlNameFrom, control: newFormControl!, fieldInfo: fi, outputPropsInfoDto: null, keyTo : newFormControlNameTo});
        this.importStatusFilterForm?.addControl(newFormControlNameFrom, newFormControl);
        if(newFormControlNameTo !== ''){
            this.importStatusFilterForm?.addControl(newFormControlNameTo, newFormControlTo);
        }        
        this.cdr.detectChanges();
         
      });      
    });         
  }

  resetCustomFilter(){
    this.selConfigPropName?.setValue(null);
    this.onConfigChange();
  }

  onConfigChange(): void {    
    this.selConfigPropValue?.setValue('');
    
    if(this.selConfigPropName?.value?.key){
      this.isConfigSelected = true;    
    }
    else{
      this.isConfigSelected = false;
    }

    if(this.isConfigSelected){
      setTimeout(() =>{
        document.getElementById('inputConfigValue')?.focus();
      },10); 
    }
  }

  loadData() {
    this.isLoading = true;
    this.importStatusItems = [];
    this.importStatusFilterForm?.disable();
    let selectedCompany: number | null = null;

    if (this.auth.selectedCompany) {
            selectedCompany = this.auth.selectedCompany.id;
        } else {
        if (this.auth?.userInfo && this.auth?.userInfo?.companies && this.auth?.userInfo?.companies.length > 0) {
            selectedCompany = this.auth.userInfo.companies[0].id;
        } else {
            throw new Error(this.tAziendaNonRecuperata);
        }
    }

    if (selectedCompany) {
      this.importStatusService.getImportStatusFilters(selectedCompany)
      .subscribe({
          next: (data: ImportStatusFilterResponseGetDto) => {
          this.dataSaveStatusFilters = data;
          this.mapFilterResponseToFormFields(data);
          let dynFilterFields : DynamicFilterFieldInfoValueDto[] = [];
          const request: ImportStatusRequestGetDto = this.getImportStatusRequestGetFromForm(dynFilterFields);

          this.importStatusService.getImportStatus(request).subscribe({
              next: (data: ImportStatusResponseGetDto) => {
              this.isLoading = true;
              if (data) {                               
                  this.setDataTable(data);
                  setTimeout(() =>{
                    let item = "idLogGenFileManager";
                    let idLogGenFileManager = Number(sessionStorage.getItem(item));
                    sessionStorage.removeItem(item);
                    if(idLogGenFileManager && idLogGenFileManager > 0){
                        // get data where id = idLogGenFileManager
                        let foundItem = data.items.find(x => x.id === idLogGenFileManager);
                        if (foundItem) {
                            this.onClickPreviewModal(foundItem);
                        }
                        else {
                            this.modalMessageService.showError(this.translate.instant("Elemento non trovato con id") + " " + idLogGenFileManager);
                        }
                    }
                  },1000);
                }
                this.isLoading = false;
                this.importStatusFilterForm?.enable();
              },
              error: (err) => {
                this.isLoading = false;
                this.importStatusFilterForm?.enable();
                this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
              }
            });
          },
          error: (err) => {
          this.isLoading = false;
          this.importStatusFilterForm?.enable();
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
          }
      });
    }
  }
    
  private mapFilterResponseToFormFields(data: ImportStatusFilterResponseGetDto) {
    this.operatoriFilterEnabled = data.operatoriFilterEnabled;
    this.operatori = data.operatori;
    
    if(this.operatoriFilterEnabled && this.operatori){
      this.operatori.unshift({ id: null, username: this.translate.instant("Tutti") });
    }
    this.esiti = data.esiti;
    if (this.esiti && this.esiti.length > 0) {
      this.esiti.unshift({ id: null, description: this.translate.instant("Tutti") });
    }

    this.categorie = data.categorie
    if (this.categorie) {
      this.categorie.unshift({ id: null, name: this.translate.instant("Tutte"), configuration: '', showSearchRawTextAttach: false, fields : [] });
    }   
    this.cataloghiList = data.fieldInfoValues;

    if (data && data.item) {
      data.item.dataInsDa = this.dateUtilsService.jsonDateToDate(data.item.dataInsDa?.toString() ?? null);
      data.item.dataInsA = this.dateUtilsService.jsonDateToDate(data.item.dataInsA?.toString() ?? null);
    }

    this.importStatusFilterForm?.patchValue(data.item);
  }

  private getImportStatusRequestGetFromForm(dynFilterFields : DynamicFilterFieldInfoValueDto[]): ImportStatusRequestGetDto {
    let selectedCompany: number | null = null;
    
    if (this.auth.selectedCompany) {
      selectedCompany = this.auth.selectedCompany.id;
    } 
    else {
      if (this.auth?.userInfo && this.auth?.userInfo?.companies && this.auth?.userInfo?.companies.length > 0) {
        selectedCompany = this.auth.userInfo.companies[0].id;
      } else {
        throw new Error(this.tAziendaNonRecuperata);
      }
    }
    
    if(this.selConfigPropName?.value === null){
      this.selConfigPropValue?.setValue(null);
    }
    
    let result = {
      companyId : selectedCompany,
      operatore: this.operatore?.value as number | null,
      dataInsDa: this.dataInsDa?.value as Date | null, //this.dateUtilsService.getDateObjectFromNgbDate(this.dataInsDa?.value as Date | null),
      dataInsA: this.dataInsA?.value as Date | null,
      esito: this.esito?.value as number | null,
      nomeAllegato: this.nomeAllegato?.value as string | null,
      categoria: this.categoria?.value as number | null,
      dataTableInfo: this.dataTableInfo,
      dynFilterFields: dynFilterFields,
      configPropName:this.selConfigPropName?.value,
      configPropValue:this.selConfigPropValue?.value,
      responseLike: this.responseLike?.value,
      rawTextLike: this.rawTextLike?.value
    };

    if (result.dataInsA) {
      result.dataInsA = new Date(result.dataInsA.setHours(23, 59, 59));
    }

    return result;
  }

  onExecuteClick() {
    this.resetAutorefresh();
    this.eseguiClicked();
  }

  eseguiClicked(isExport:boolean = false, reportType:number = 0, url: string = '') {
    if(this.dateUtilsService.validateNgbDateRange(this.dataInsDa?.value as Date | null, this.dataInsA?.value as Date | null)){
      console.log(this.dataTableInfo);
      // this.dataTableInfo.pageInfo.pageNumber = 0;
      // this.dataTableInfo.pageInfo.size = 10;
      // this.cdr.detectChanges();
      this.loadImportStatusFiltered(isExport, reportType, url);
      this.cdr.detectChanges();      
    }
    else{
      this.modalMessageService.showError(this.modalMessageService.dateRangeError(this.tInserimento));
    }
  }

  resetFilters() {
    this.isLoading = true;
    this.responseLike?.setValue(null);
    this.rawTextLike?.setValue(null);
    this.operatore?.setValue(null);
    this.operatoreObj?.setValue(null);
    this.dataInsDa?.setValue(null);
    this.dataInsA?.setValue(null);
    this.esito?.setValue(null);
    this.esitoObj?.setValue(null);
    this.categoria?.setValue(null);
    this.categoriaObj?.setValue(null);
    this.nomeAllegato?.setValue(null);
    this.selConfigPropName?.setValue(null);
    this.selConfigPropValue?.setValue(null);
    this.importStatusFilterForm?.reset();
    this.resetAutorefresh();

    this.importStatusFilterForm?.patchValue(this.dataSaveStatusFilters!.item);
    setTimeout(() =>{
      this.changeSelCategoria();
      this.eseguiClicked();
    },10);     

  }

   
  loadImportStatusFiltered(isExport:boolean = false, reportType:number = 0, url: string = '') {
    this.isLoading = true;
    this.importStatusItems = [];
    this.isLoadingTable = true;
    let dynFlds : DynamicFilterFieldInfoValueDto[] = [];
    this.dynamicFieldsFormControls.forEach(x => {
      const id = this.getFldName(x.fieldInfo!, false);
      const ctl = this.importStatusFilterForm?.get(id);
      let ctlTo;
      let isRangeValue = x.keyTo !== "";
      let valueString = "";
      let valueStringTo = "";
      // Se esiste isRangeValue recuperiamo il secondo campo per il range
      if(isRangeValue){
        ctlTo = this.importStatusFilterForm?.get(id + "_To");
      }

      if(ctl?.value !== null){
        if((x.fieldInfo?.type === 'datetime' || x.fieldInfo?.type === 'date')){
          valueString = this.dateUtilsService.getDateStringFromNgbDate(ctl?.value) || '';
          if(isRangeValue && ctlTo?.value !== null){
            if(!this.dateUtilsService.validateNgbDateRange(ctl?.value as Date | null, ctlTo?.value as Date | null)){
              this.modalMessageService.showError(this.modalMessageService.dateRangeError(x.fieldInfo?.label));
              return;
            }
            valueStringTo = this.dateUtilsService.getDateStringFromNgbDate(ctlTo?.value) || '';
          }
        }
        else{
          if(isRangeValue){
            valueStringTo = ctlTo?.value?.toString();
            if(parseFloat(valueString) >= parseFloat(valueStringTo)){
              this.modalMessageService.showError(`${this.tIntervalloValori} ${x.fieldInfo?.label!} ${this.tErrato}!`);
              return;
            }
          }
          if(x.fieldInfo!.type === 'typeahead'){
            valueString = ctl?.value.code;
          }
          else{
            valueString = ctl?.value.toString();
          }
        }
      }

      const d : DynamicFilterFieldInfoValueDto = { label:x.fieldInfo?.label ?? "" , type:x.fieldInfo?.type ?? "", value: valueString, valueTo: valueStringTo };
      dynFlds.push(d);
    });

    const request: ImportStatusRequestGetDto = this.getImportStatusRequestGetFromForm(dynFlds);

    this.importStatusService.getImportStatus(request).subscribe({
      next: (data: ImportStatusResponseGetDto) => {
        if (data) {
          this.setDataTable(data);
          if(isExport){
            this.importStatusService.getImportStatusReports(request, url, reportType)
              .subscribe((response) => {
                this.isLoading = false;
                this.saveAs(response);
              });
          }
        }   
        this.isLoading = false;
        this.isLoadingTable = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isLoadingTable = false;
        this.importStatusFilterForm?.enable();
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
      }
    });  
  }
  
  saveAs(response:any): void {
    if(response.body !== null){
      this.generalUtilsService.downloadBlobType(response.body, response.body.type, 
        this.generalUtilsService.getXFileNameFromRepsonse(response));
    }
  }

  changeSelOperatore() {
    this.operatore?.setValue(this.operatoreObj?.value?.id);
  }

  changeSelCategoria() {
    this.categoria?.setValue(this.categoriaObj?.value?.id);
  }

  changeSelEsito() {
    this.esito?.setValue(this.esitoObj?.value?.id);
  }


  isInRole(roles: string): boolean {
    return this.auth.isInRole(roles);
  }

  exportXlsxResult(url: string): void {
    this.eseguiClicked(true, 1, url);
  }

  getFldName(fi: FieldInfoDto, isFiTo: boolean):string {
    return `FI_${fi.id.toString()}${isFiTo ? '_To' : ''}`;
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }

  downloadAppJsonBlob(content : string, name : string) {
    this.generalUtilsService.downloadAppJsonBlob(content, name);
  }

  loadFromServer($event: TableLazyLoadEvent) {
    setTimeout(() => {
        this.isLoadingTable = true;
        let first = $event.first ?? 0;
        let rows = $event.rows ?? 10;

        this.dataTableInfo.pageInfo.pageNumber = Math.floor(first / rows);
        this.dataTableInfo.pageInfo.size = rows;
        this.dataTableInfo.sortInfo.prop = typeof $event.sortField === 'string'
          ? $event.sortField : Array.isArray($event.sortField) && $event.sortField.length > 0 ? $event.sortField[0] : '';
        this.dataTableInfo.sortInfo.dir = $event.sortOrder === 1 ? 'asc' : 'desc';
        this.loadImportStatusFiltered(false);
        this.isLoadingTable = false; 
    }, 10);
  }

  setDataTable(data: ImportStatusResponseGetDto) {
      this.cdr.detectChanges();
      this.importStatusItems = data.items;
      this.dataTableInfo = data.dataTableInfo;
      this.totalRecords = data.dataTableInfo.pageInfo.totalElements;      
      this.cdr.detectChanges();    
  }

  canShowLogItems(isShowLog: boolean): boolean {
    return (this.isInRole('DownloadImportFileAsBase64') || this.isInRole('DownloadImportFileAsS3') || (isShowLog &&  this.isInRole('ShowLogGenWorkflowSteps')));
  }

  getLogTypes(row: ImportStatusDto,isShowLog: boolean): LogTypeDto[]{
    let result : LogTypeDto[] = [];
    if(isShowLog && this.isInRole('ShowLogGenWorkflowSteps')){
      result.push({rowId: LogTypes.Operazioni + '_' + row.id, logType: LogTypes.Operazioni, id: row.id, fileName: '', filePath: '', direction: '' });
    }
    if(row.lstAttachmentDto !== null && row.lstAttachmentDto.length > 0){
      row.lstAttachmentDto.filter(x => x.direction === 'P').forEach((x) => {
        if(this.isInRole('DownloadImportFileAsBase64')){
          result.push({rowId: LogTypes.Base64 + '_' + row.id, logType: LogTypes.Base64, id: row.id, fileName: x.fileName, filePath: x.filePath, 
            direction: x.direction});
        }
        if(this.isInRole('DownloadImportFileAsBase64')){
          result.push({rowId: LogTypes.S3 + '_' + row.id, logType: LogTypes.S3, id: row.id, fileName: x.fileName, filePath: x.filePath, 
            direction: x.direction});
        }        
      });
    }

    return result;
  }

  onRowExpand(event: TableRowExpandEvent) {
        
  }

  onRowCollapse(event: TableRowCollapseEvent) {
      
  }

  formatFldValue(fld: DynamicFieldInfoValueDto):string {
    let localeIt = 'it-IT';
    let result = fld.value;
    if(fld.value !== ''){
      switch (fld.type) {
        case 'integer':
          result = formatNumber(parseInt(fld.value), localeIt, '1.0-0');
          break;
        case 'decimal':
          result = formatNumber(parseFloat(fld.value), localeIt, '1.2-2');
          break;
        case 'currency':
          result = formatCurrency(parseFloat(fld.value), localeIt, '€', 'EU', '1.2-2');
          break;
        case 'date':
          result = formatDate(fld.value, 'dd/MM/yyyy', localeIt);
          break;
        case 'datetime':
          result = formatDate(fld.value, 'dd/MM/yyyy hh:mm:ss', localeIt);
          break;
        case 'boolean':
          result = fld.value.toUpperCase() === 'true' ? 'Si' : 'No';
          break;
        default:
          break;
      }
    }
    return result;
  }

  downloadTextPlainBlob(content : string, name : string) {
    this.generalUtilsService.downloadTextPlainBlob(content, name);
  }
   
  getTagClassForState(state: number): string {
    return this.importStatusService.getTagClassForState(state);
  }

  getLabelForState(state: number): string {
    return this.importStatusService.getLabelForState(state);
  }

  onHidePreviewEvent(data: GenericFileUploadDetailResponsePostDto) {
      this.showFinderPreview = false;
      this.cdr.detectChanges();
      if (data) {
        this.eseguiClicked();
      }
  }

  onClickPreviewModal(rowItem: ImportStatusDto) {
      rowItem.isRowLoading = true;
      this.resetAutorefresh();
      this.openJsonPreviewModal(rowItem.id);
  }
  resetAutorefresh() {
    this.isAutoRefresh = false;
    this.autorefreshCounter = 0;
  }

  openJsonPreviewModal(id: number): void {
    // Implement the logic for opening the JSON preview modal here
    this.cdr.detectChanges();
    this.jsonPreviewService.getPreviewStatus(id).subscribe({
      next: (data: PreviewStateDto) => {
        let msg = '';
        if (data.isClosed) {
          msg = this.translate.instant("Il record selezionato è stato già elaborato dall'utente : {{user}}, in data : {{date}}.Non è possibile effettuare modifiche.", { user: data.lastUpdateUser, date: this.dateUtilsService.dateIsoToItaDateString(data.lastUpdateTs) });
          this.modalMessageService.showError(msg);
          this.eseguiClicked();
          return;
        }
        else if (!data.canPreview) {
          msg = this.translate.instant("L'anteprima per il record selezionato è stata già aperta dall'utente : {{user}}, in data : {{date}}.Proseguendo verranno sovrascritte le sue modifiche. Confermi l'operazione?", { user: data.lastUpdateUser, date: this.dateUtilsService.dateIsoToItaDateString(data.lastUpdateTs) });
          this.modalMessageService.showConfirm(msg, false, true)
              .subscribe((result: "accept" | "reject" | "cancel") => {

                if (result === "accept") {
                  this.getJsonPreviewById(id);
                }
                else if (result === "reject") {
                  this.eseguiClicked();
                }     

              });                  
        }
        else {
          this.getJsonPreviewById(id);
        }
      },
      error: (err: string) => {
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        this.eseguiClicked();
      }
    });
  }

  private getJsonPreviewById(id: number) {
    this.jsonPreviewService.getJsonPreview(id).subscribe({
      next: (data: JsonPreviewResponseDto) => {
        this.dataInput = {
          requestId: data.requestId,
          mappedJsonFinderFields: data.mappedJsonFinderFields,
          remappedClassifierPages: data.remappedClassifierPages,
          jsonPreviewType: null,
          fileContentB64: data.fileContentB64 ?? '',
          uploadedFileName: data.uploadedFileName ?? '',
          pagedMappedJsonFinderFields: data.pagedMappedJsonFinderFields,
        };

        this.showFinderPreview = true;
        this.cdr.detectChanges();
      },
      error: (err: string) => {
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        this.eseguiClicked();
      }
    });
  }

  onCloseAccordion() {
    this.pageRows = 10;
  }

  onOpenAccordion() {
    this.pageRows = 5;    
  }

  getRecordStateTooltip(rowData: ImportStatusDto) : string {
    return this.translate.instant("Aggiornato da") + ": " + (rowData.lastUpdateUser ?? 'n.d.') + " " + this.translate.instant("in data") + ": " + this.dateUtilsService.dateIsoToItaDateString(rowData.lastUpdateTs);
  }

  onAutoRefreshChange($event: ToggleButtonChangeEvent) {
    this.isAutoRefresh = $event.checked ?? false;
    this.setAutoRefresh()
  }

  setAutoRefresh() {
    if(this.isAutoRefresh){
      this.autorefreshCounter++;
      console.log('AutoRefresh n. ' + this.autorefreshCounter);
      if(this.autorefreshCounter >= 30){
        this.isAutoRefresh = false;
        this.autorefreshCounter = 0;
        console.log('AutoRefresh disattivato');
        return;
      }
      this.eseguiClicked();
      setTimeout(() => {
        if(this.isAutoRefresh){
          this.eseguiClicked();
          this.setAutoRefresh();
        }
      }, 5000);
    }
    else{
      this.autorefreshCounter = 0;
    }
  }

  getAutoRefreshTooltip() : string {
    return this.isAutoRefresh ? this.translate.instant('Disattiva Auto Refresh') : this.translate.instant('Attiva Auto Refresh (x 10 volte)');
  }

}