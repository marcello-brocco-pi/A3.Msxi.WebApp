import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaDto, FieldInfoValuesDto } from '../models/categoriaDto.model';
import { Subscription } from 'rxjs';
import { DynamicFormControlInfo } from '../models/dynamicFormControlInfo.model';
import { FileUploadStatus } from '../models/file-upload-status.enum';
import { GenericFileUploadDetailResponsePostDto, JsonPreviewResponseDto, LogGenFileManagerAttachmentDto } from '../models/genericFileUploadDetailResponsePostDto.model';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ModalMessageService } from '../../../../shared/modal-message/modal-message.service';
import { DateUtilsService } from '../../shared/services/date-utils.service';
import { GenericFileUploadService } from '../services/generic-file-upload-service.service';
import { FieldInfoDto } from '../models/fieldInfoDto.model.ts';
import { DropdownValueDescDto } from '../../../../core/models/dropdown-value-desc-dto.model';
import { DocumentUploadDetailResponseGetDto } from '../models/documentUploadDetailResponseGetDto.model';
import { DynamicFieldInfoValueDto } from '../../../../core/models/dynamic-fieid-info-value-dto.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { GenericCodeJsonPanelComponent } from "../../generic-code-json-panel/generic-code-json-panel.component";
import { ProgressBarModule } from 'primeng/progressbar';
import { GenericProcessStatusComponent } from "../../generic-process-status/generic-process-status.component";
import { GenericJsonFinderPreviewModalComponent } from "../../generic-json-preview/generic-json-finder-preview-modal/generic-json-finder-preview-modal.component";
import { FileRemoveEvent, FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { FilesUploadDto, ContentFilesDto } from '../models/genericFileUploadDetailRequestPostDto.model';
import { Checkbox } from 'primeng/checkbox';
@Component({
    selector: 'app-generic-file-upload-detail',
    imports: [TranslateModule, ReactiveFormsModule, CommonModule, FluidModule, SelectModule, ProgressBarModule,
    InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule, GenericCodeJsonPanelComponent, 
    GenericProcessStatusComponent, GenericJsonFinderPreviewModalComponent, FileUpload, FormsModule, Checkbox],
    standalone: true,
    templateUrl: './generic-file-upload-detail.component.html',
})

export class GenericFileUploadDetail  extends ComponentBaseComponent implements OnInit, OnDestroy {
    @Input() ImportType: 'FINDER' | 'CLASSIFIER' | null = null;
    
    fileUploadForm: FormGroup | null = null;
    isLoadingDetail: boolean = false;
    categorieList: CategoriaDto[] = [];
    cataloghiList: FieldInfoValuesDto[] = [];
    thModel: FieldInfoValuesDto[] = [];
    dynamicFieldsFormControls: DynamicFormControlInfo[] = [];
    dynamicCheckForPropsFormControls: DynamicFormControlInfo[] = [];
    fileUploadStatus: FileUploadStatus = FileUploadStatus.NOT_UPLOADED;
    fileUploadStatusText: string = '';
    fileUploadProgressVisible: boolean = false;
    componentDisabled: string = '';
    fileUploadDetailResponse: GenericFileUploadDetailResponsePostDto = { items: [], analysisResponse: '',
        isJsonPreview: null, jsonPreviewType: null, requestId: null, mappedJsonFinderFields: null, fileContentB64: null, 
        remappedClassifierPages: null, uploadedFileName: null, lstAttachmentDto: null, contentResult: null, status: '',
        pagedMappedJsonFinderFields: null };
    categorieSubscription: Subscription | null = null;
    analysisResponse: string = '';
    codeJson: any = null;
    lstAttachmentDto: LogGenFileManagerAttachmentDto[]|null = [];
    typeTitle : string | null = null;
    gotoStoricoUrl: string| null = null;  
    categoryTitle : string | null = null;
    idFieldInfoValueGroupsSelected:number = 0;
    tAziendaNonRecuperata: string = '';
    tErroreClient: string = '';
    tCategoriaNotNull: string = '';
    tNotConvertJson: string = '';
    tImportDocument: string = '';
    tCategoria: string = '';
    uploadedFiles: any[] = [];
    showFinderPreview: boolean = false;
    dataInput: JsonPreviewResponseDto = {
        requestId: null,
        mappedJsonFinderFields: null,
        remappedClassifierPages: null,
        jsonPreviewType: null,
        fileContentB64: '',
        uploadedFileName: '',
        pagedMappedJsonFinderFields: null
    };
    filesToUpload : FilesUploadDto[] = [];


    public constructor(private modalMessageService: ModalMessageService, private genericFileUploadService: GenericFileUploadService,
        private dateUtilService: DateUtilsService, private auth: AuthService, private router : Router, translate: TranslateService,
        private chc : ChangeDetectorRef) {
        super(translate);
        this.idFieldInfoValueGroupsSelected = 0;
    }

    
    override applyTranslation(): void {
        this.tAziendaNonRecuperata = this.translate.instant("Azienda non recuperata");
        this.tErroreClient = this.translate.instant("Errore client");
        this.tCategoriaNotNull = this.translate.instant('categoria non può essere null');
        this.tNotConvertJson = this.translate.instant("Non è stato possibile convertire il risultato in formato JSON:");
        this.tImportDocument = this.translate.instant("Import documento");
        this.tCategoria = this.translate.instant("Categoria");
        this.typeTitle = this.tImportDocument;
        this.categoryTitle = this.tCategoria;
    }

    get categoria() {
        return this.fileUploadForm?.get('categoria');
    }

    get categoriaObj() {
      return this.fileUploadForm?.get('categoriaObj');
    }

    get pagesFilter() {
        return this.fileUploadForm?.get('pagesFilter');
    }

    get promptHint() {
        return this.fileUploadForm?.get('promptHint');
    }
     
    override ngOnInit(): void {
        super.ngOnInit();
        this.gotoStoricoUrl = '/importstatus';
        this.createFileUploadForm();
        this.setInitialStatus();
        this.onFileUploadFormChanges();
        this.loadData();
    }

    loadData() {

        this.fileUploadForm?.reset();
        this.isLoadingDetail = true;
        this.fileUploadForm?.disable();
        
        let selectedCompany: number | null = null;
        if (this.auth.selectedCompany) {
            selectedCompany = this.auth.selectedCompany.id;
        }else {
            if (this.auth?.userInfo && this.auth?.userInfo?.companies && this.auth?.userInfo?.companies.length > 0) {
                selectedCompany = this.auth.userInfo.companies[0].id;
            } else {
                throw new Error(this.tAziendaNonRecuperata);
            }
        }

        if (selectedCompany) {
            this.genericFileUploadService.getFileUploadDetail(selectedCompany, this.ImportType!)
            .subscribe({
                next: (data: DocumentUploadDetailResponseGetDto) => {

                    this.categorieList = data.categorie;
                    if (this.categorieList) {
                        this.categorieList.unshift({
                            id: null, name: this.translate.instant("Scegli una") + ' ' + this.tCategoria, configuration: '', fields: [],
                            showOutputPropsPrompts: false,
                            outputPropsInfoDto: []
                        });
                    }
                    this.cataloghiList = data.fieldInfoValues;
                    this.isLoadingDetail = false;
                    this.fileUploadForm?.enable();

                },
                error: (err) => {
                    this.isLoadingDetail = false;
                    this.fileUploadForm?.enable();
                    this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
                }
            });
        }
    }

    async uploadFile() {

        if (!this.categoria?.value) {
            this.modalMessageService.showError(this.tErroreClient);
            throw new Error(this.tCategoriaNotNull);
        }

        if (this.fileUploadForm?.valid) {

            this.setUploadStatusUploading();

            try {
                
                let dynFlds : DynamicFieldInfoValueDto[] = [];

                this.dynamicFieldsFormControls.forEach(x => {
                const id = this.getFldName(x.fieldInfo!);
                const ctl = this.fileUploadForm?.get(id);
                let valueString = "";

                if(ctl?.value !== null){
                    if((x.fieldInfo?.type === 'datetime' || x.fieldInfo?.type === 'date')){
                    valueString = this.dateUtilService.getDateStringFromNgbDate(ctl?.value) || '';
                    }
                    else{
                    if(x.fieldInfo!.type === 'typeahead'){
                        valueString = ctl?.value.code;
                    }
                    else{
                        valueString = ctl?.value.toString();
                    }
                    }
                }

                const d : DynamicFieldInfoValueDto = { label:x.fieldInfo?.label ?? "" , type:x.fieldInfo?.type ?? "", value: valueString, isInput:true  };
                    dynFlds.push(d);
                });
                
                this.genericFileUploadService.postFileUploadDetail(this.fileUploadForm, this.dynamicCheckForPropsFormControls,
                '', dynFlds, this.filesToUpload).subscribe({
                next: (data: GenericFileUploadDetailResponsePostDto) => {
                    // if(data.isJsonPreview){
                    
                    //     this.dataInput = {
                    //         requestId: data.requestId,
                    //         mappedJsonFinderFields: data.mappedJsonFinderFields,  
                    //         pagedMappedJsonFinderFields: data.pagedMappedJsonFinderFields,         
                    //         remappedClassifierPages: data.remappedClassifierPages,
                    //         jsonPreviewType: null,
                    //         fileContentB64: data.fileContentB64 ?? '',
                    //         uploadedFileName: data.uploadedFileName ?? ''
                    //     };
                    //     this.showFinderPreview = true;
                    //     this.fileUploadProgressVisible = false;
                    //     this.chc.detectChanges();
                    // }
                    // else{
                    //     this.handleFileUploadResponse(data);
                    // }

                    this.handleFileUploadResponse(data);
                    this.filesToUpload = [];
                    this.fileUploadForm?.enable();
                },
                error: (err) => {
                    this.setUploadStatusImportCompletedWithErrors();
                    this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
                }
            });
        } catch (err) {
            this.setUploadStatusImportCompletedWithErrors();
            this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        }
    }
  }

  setUploadStatusUploading() {
    this.fileUploadProgressVisible = true;
    this.fileUploadForm?.disable();
    this.fileUploadStatus = FileUploadStatus.UPLOADING; // Abilita il componente Process-Status  
  }


  setUploadStatusImportCompletedWithErrors() {
    this.fileUploadStatus = FileUploadStatus.UPLOAD_COMPLETED;
    // this.fileUploadStatusText = 'Import terminato con errori.';
    this.fileUploadProgressVisible = false;
    this.fileUploadForm?.enable();
    this.codeJson = null;
    //this.fileUploadMainIconClass = 'bi-x-circle-fill text-danger';
    this.componentDisabled = 'disabled';
  }

  handleFileUploadResponse(data: GenericFileUploadDetailResponsePostDto) {
    this.fileUploadProgressVisible = false;
    this.fileUploadStatus = FileUploadStatus.UPLOAD_COMPLETED;
    this.fileUploadDetailResponse.items = data.items;
    if (data && data.analysisResponse) {
      this.analysisResponse = data.analysisResponse;
      try {
        this.codeJson = JSON.parse(this.analysisResponse);
        this.lstAttachmentDto = data.lstAttachmentDto;
      } catch (error) {
        this.codeJson = this.tNotConvertJson + ' ' + this.analysisResponse;
      }
    } else {
      this.analysisResponse = '';
      this.codeJson = null;
    }
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 1000);   
  }


    override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.categorieSubscription) {
            this.categorieSubscription.unsubscribe();
        }
    }

    createFileUploadForm() {
        this.fileUploadForm = new FormGroup({
        categoria: new FormControl<number | null>(null, Validators.required),
        categoriaObj: new FormControl<any | null>(null),
        promptHint: new FormControl<string | null>(null),
        });
    }

    setInitialStatus() {
        this.isLoadingDetail = false;
        this.categorieList = [];
        this.fileUploadStatus = FileUploadStatus.NOT_UPLOADED;
        this.fileUploadProgressVisible = false;
        //this.fileUploadMainIconClass = 'bi-cloud-arrow-up-fill text-primary';
        this.fileUploadDetailResponse = { items: [], analysisResponse: '', isJsonPreview: null, jsonPreviewType: null,
        requestId: null, mappedJsonFinderFields: null, fileContentB64: null, remappedClassifierPages: null ,
        uploadedFileName: null, lstAttachmentDto: null, contentResult: null, status: '', pagedMappedJsonFinderFields: null   };
        this.componentDisabled = '';
        this.codeJson = null;
        this.dynamicFieldsFormControls = [];
        this.dynamicCheckForPropsFormControls = [];    
    }

    onFileUploadFormChanges(): void {
        if (this.fileUploadForm) {

            if (!this.categorieSubscription) {
                this.categorieSubscription = this.categoria?.valueChanges.subscribe(val => {
                //this.isLoadingDetail = true;
                /*** Evita il problema dei refresh sui campi not required dinamici ***/
                this.dynamicFieldsFormControls.forEach(x => {
                    if(!x.fieldInfo?.required){
                    this.doSetDynamicField(true, x.fieldInfo!);
                    this.doSetDynamicField(false, x.fieldInfo!);
                    }
                });

                this.dynamicFieldsFormControls = [];
                setTimeout(() =>{
                    this.fillDynamicFieldsFormControls();
                    this.filldynamicCheckForPropsFormControls();
                    //this.isLoadingDetail = false;
                },10);
                /**********************************************************************/
                }) as Subscription | null;
            }
        }
    }

    fillDynamicFieldsFormControls() {
        this.dynamicFieldsFormControls = [];
        if (this.categoria?.value) {
            const filteredCategories = this.categorieList.filter(c => c.id == this.categoria?.value);
            if (filteredCategories && filteredCategories.length > 0) {
                const selectedCategory = filteredCategories[0];
                if (selectedCategory.fields && selectedCategory.fields.length > 0) {
                    for (const fi of selectedCategory.fields) {
                    const newFormControlName = this.getFldName(fi);
                    let newFormControl: FormControl | null = null;
                    switch (fi.type) {
                        case 'decimal':
                        case 'integer':
                        case 'currency':
                        newFormControl = new FormControl<number | null>(null);
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
                        break;
                        case 'boolean':
                        newFormControl = new FormControl<boolean | null>(null);
                        break;
                        default:
                        break;
                    }
                    // Impostazione default campo dinamico
                    if(fi.fldDefaultValue !== null && fi.fldDefaultValue !== '') {
                        newFormControl?.setValue(fi.fldDefaultValue);
                    }

                    if (newFormControl) {
                        if(fi.type !== 'boolean'){
                        if(!fi.required){
                            newFormControl.disable();
                        }
                        else{
                            newFormControl.setValidators([Validators.required]);
                        }
                    }

                    this.dynamicFieldsFormControls.push({ key: newFormControlName, control: newFormControl, fieldInfo: fi, outputPropsInfoDto: null });
                    this.fileUploadForm?.addControl(newFormControlName, newFormControl);
                    }
                }
                }
            }
        }
    }

    doSetDynamicField(isChecked: boolean, fldInfo:FieldInfoDto|null) {
        const id = this.getFldName(fldInfo!);
        const ctl = this.fileUploadForm?.get(id);
        if(isChecked){
            ctl?.enable();
            ctl?.markAsDirty();
            ctl?.markAsTouched();
            ctl?.setErrors({'incorrect': true});
            ctl?.setValidators([Validators.required]);
            ctl?.updateValueAndValidity();
        }
        else{
            ctl?.reset();
            ctl?.disable();
            ctl?.setErrors({});
            ctl?.setValidators([]);
        }
    }

    filldynamicCheckForPropsFormControls() {
        this.dynamicCheckForPropsFormControls = [];

        if (this.categoria?.value) {
                const filteredCategories = this.categorieList.filter(c => c.id == this.categoria?.value);
                if (filteredCategories && filteredCategories.length > 0) {
                    const selectedCategory = filteredCategories[0];        
                    if (selectedCategory.showOutputPropsPrompts && selectedCategory.fields && selectedCategory.outputPropsInfoDto.length > 0) {
                    for (const opi of selectedCategory.outputPropsInfoDto) {
                        const newFormControlName = "OPI_" + opi.id.toString();
                        let newFormControl: FormControl | null = new FormControl<boolean>(opi.defaultValue);
                        if (newFormControl) {
                            this.dynamicCheckForPropsFormControls.push({ key: newFormControlName, control: newFormControl, fieldInfo: null, outputPropsInfoDto: opi });
                            this.fileUploadForm?.addControl(newFormControlName, newFormControl);
                        }
                    }
                }
            }
        }
    }
    
    getFldName(fi: FieldInfoDto):string {
        return  `FI_${fi.id.toString()}`;
    }

    getListValuesFromJson(listValues: any): any {
        let jsonList = JSON.parse(listValues);
        let result : DropdownValueDescDto[] = [];
        jsonList.forEach((x: any) => {
        let d : DropdownValueDescDto = { value:x.value , description:x.description };
            result.push(d);
        });
        return result;
    }

    getCatalogo(idFieldInfoValueGroups: number): any {
        let result : DropdownValueDescDto[] = [];
        this.cataloghiList.forEach((x: any) => {
            if(x.idFieldInfoValueGroups === idFieldInfoValueGroups){
                let d : DropdownValueDescDto = { value:x.code , description:x.description };
                result.push(d);
            }
        });
        return result;
    }

    setLabel(fld: FieldInfoDto): string {
        return fld?.label + (fld.required ? "*" : "");
    }

    gotoStorico() {
        this.router.navigate([this.gotoStoricoUrl]);
    }

    changeSelCategoria() {
        this.categoria?.setValue(this.categoriaObj?.value?.id);
    }

    startNewUpload(isNewUpload: boolean) {
        this.filesToUpload = [];
        let idSelCat = this.categoria?.value;  
        let idSelCatObj = this.categoriaObj?.value;  
        this.fileUploadForm?.reset();
        if (this.categorieSubscription) {
            this.categorieSubscription?.unsubscribe();
            this.categorieSubscription = null;
        }
        this.ngOnInit();
        if(!isNewUpload)
        {
            setTimeout(() =>{
                this.categoriaObj?.setValue(idSelCatObj);
                this.categoria?.setValue(idSelCat);
            },1000);                
        }
    }

    onHidePreviewEvent(data: GenericFileUploadDetailResponsePostDto) {
        if (data) {
            let response = data as GenericFileUploadDetailResponsePostDto;
            this.handleFileUploadResponse(response);
        }
    }

    onDeleteUploadedItem(idx: number) {
        const index = this.filesToUpload.findIndex(item => item.idx === idx);
        if (index > -1) {
            this.filesToUpload.splice(index, 1);
        }
    }

    onAddUploadedItem() {
        // Find the max value not the length and add a new one
       if(this.filesToUpload) {
           const newIdx = this.filesToUpload.length > 0
               ? this.filesToUpload[this.filesToUpload.length - 1].idx + 1
               : 1;

            this.filesToUpload.push({ idx: newIdx, isMerge: false, pagesFilter: '', contentFiles: [] });
            this.chc.detectChanges();
       }
    }

    async onSelectedFiles($event: FileSelectEvent, idx: number) {        
        // Get the this.filesToUpload item where idx === id
        const fileUploadItem = this.filesToUpload.find(item => item.idx === idx);
        if (fileUploadItem) {
            const filesArray = Array.from($event.files);
            filesArray.forEach(async (file) => {
                const newFile: ContentFilesDto = {
                    fileName: file.name,
                    contentType: file.type,
                    fileContent: await this.genericFileUploadService.blobToBase64(file) as string
                };
                fileUploadItem.contentFiles.push(newFile);
            });
        }
    }

     onRemoveFile($event: FileRemoveEvent, idx: number) {       
        const fileUploadItem = this.filesToUpload.find(item => item.idx === idx);
        if (fileUploadItem) {
            // remove the file from the files array where file.fileName == $event.file.name
            const fileIndex = fileUploadItem.contentFiles.findIndex(file => file.fileName === $event.file.name);
            if (fileIndex > -1) {
                fileUploadItem.contentFiles.splice(fileIndex, 1);
                if(fileUploadItem.contentFiles.length <= 1){
                    fileUploadItem.isMerge = false;
                }
            }
            console.log(fileUploadItem);
        }   
    }

    isFormValid() {
        // Check isValidPagesFilter for each item
        const isValidPagesFilter = this.filesToUpload.every(item => this.isValidPagFilter(item.pagesFilter));
        // true if at least one file is present in the filesToUpload array and at least one file is selected
        return this.fileUploadForm?.valid && this.filesToUpload.length > 0 && this.filesToUpload.some(item => item.contentFiles.length > 0) 
        && isValidPagesFilter;
    }

    isOnlySameExtFile(item: FilesUploadDto): boolean {
        if(item.contentFiles.length == 0) 
            return false;
        // const exts = item.contentFiles.map(file => file.fileName.split('.').pop());
        // let isSame = exts.every(ext => ext === exts[0]);
        return true;
    }

    isMergeOnlySameExtFile(item: FilesUploadDto): boolean {
        if(item.contentFiles.length <= 1) 
            return false;
        // const exts = item.contentFiles.map(file => file.fileName.split('.').pop());
        // let isSame = exts.every(ext => ext === exts[0]);
        // return isSame;

        return true;
    }

    isValidPagFilter(value: string) {
        // validate rules  3 oppure 1-3 oppure 1,2,5'
        let res = true;
        if(value) {
            const regex = /^(?:\d+|\d+-\d+|\d+(?:,\d+)*)$/;
            res = regex.test(value);
        }
        return res;
    }

    //   async getMultipleFiles(): Promise<MultipleFilesDto[]> {
//       const files: MultipleFilesDto[] = [];
//       if (this.files) {
//           for (const f of this.files) {
//               co\nst file: MultipleFilesDto = {
//                   fileName: f.name,
//                   fileContent: await this.genericFileUploadService.blobToBase64(f) as string,
//                   contentType: f.type
//               };
//               files.push(file);
//           }
//       }
//       return files;
//   }

   
}