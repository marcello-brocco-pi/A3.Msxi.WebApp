import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../../shared/services/service-base.service';
import { DocumentUploadDetailResponseGetDto } from '../models/documentUploadDetailResponseGetDto.model';
import { DynamicFormControlInfo } from '../models/dynamicFormControlInfo.model';
import { GenericFileUploadDetailResponsePostDto } from '../models/genericFileUploadDetailResponsePostDto.model';
import { DynamicFieldInfoValueDto } from '../../../../core/models/dynamic-fieid-info-value-dto.model';
import { FilesUploadDto, GenericFileUploadDetailRequestPostDto } from '../models/genericFileUploadDetailRequestPostDto.model';
import { OutputPropValueDto } from '../models/outputPropValueDto.model';



@Injectable({
    providedIn: 'root'
})
export class GenericFileUploadService extends ServiceBaseService {
    private tFileNotNull! : string;
    private tCategoryNotNull! : string;
    private tSelectedCompanyNotNull! : string;
    private tFileUploadFormNotNull! : string;
    tFileNameNotNull! : string;
    tDynamicCheckNotNull! : string;
    tOutputPropsInfoNotValid! : string;

    constructor(private http: HttpClient, translate : TranslateService) {
        super(translate);
    }

    protected override applyTranslation(): void {
        this.tFileNotNull = this.translate.instant('file non può essere nullo');
        this.tCategoryNotNull = this.translate.instant('category non può essere nullo');
        this.tSelectedCompanyNotNull = this.translate.instant('selectedCompany non può essere nullo');
        this.tFileUploadFormNotNull = this.translate.instant('fileUploadForm non può essere nullo');  
        this.tFileNameNotNull = this.translate.instant('fileName non può essere nullo');   
        this.tDynamicCheckNotNull = this.translate.instant('dynamicCheckForPropsFormControls non può essere nullo');   
        this.tOutputPropsInfoNotValid = this.translate.instant('outputPropsInfoDto non valido');
    }

    public getFileName(file: File, category: number, selectedCompany: number): string {
      if (file == null) {
        throw new Error(this.tFileNotNull);
      }
      if (!category) {
          throw new Error(this.tCategoryNotNull);
      }
      if (!selectedCompany) {
          throw new Error(this.tSelectedCompanyNotNull);
      }

      let extIndex= file.name.lastIndexOf('.');
      let ext = '';
      if (extIndex >= 0) {
          ext = file.name.substring(extIndex);
      }

      let fileName = file.name.substring(0,extIndex).replace(/\s/g, '');
      fileName = selectedCompany + '_' + category + '_' + fileName + '_' + new Date().getTime() + ext;

      return fileName;
    }

    public blobToBase64 = (postedfile: Blob) => new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(postedfile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    public getFileUploadDetail(companyId : number, categoryType : string): Observable<DocumentUploadDetailResponseGetDto> {

        let params = new HttpParams()
            .append("companyId", companyId ?? '')
            .append("categoryType", categoryType ?? '');

        return this.http.get<DocumentUploadDetailResponseGetDto>(this.BASE_URL + '/GEN/FileUpload', {params : params})
            .pipe(
                catchError(this.handleError.bind(this))
            );
    }

    public postFileUploadDetail(fileUploadForm: FormGroup, dynamicCheckForPropsFormControls: DynamicFormControlInfo[],
      etag: string, dynFlds: DynamicFieldInfoValueDto[], multipleFiles: FilesUploadDto[]): Observable<GenericFileUploadDetailResponsePostDto> {
        if (!fileUploadForm) {
            throw new Error(this.tFileUploadFormNotNull);
        }

        if (multipleFiles.length === 0) {
            let m = this.translate.instant('Non ci sono file da caricare');
            throw new Error(m);
        }

        if (!dynamicCheckForPropsFormControls) {
            throw new Error(this.tDynamicCheckNotNull);
        }

        const selectedCategory = fileUploadForm.get('categoria');
        const promptHint = fileUploadForm.get('promptHint');
        const pagesFilter = fileUploadForm.get('pagesFilter');
        const outputPropValueList : OutputPropValueDto[] = [];
        for (const op of dynamicCheckForPropsFormControls) {
            if (!op.outputPropsInfoDto || !op.outputPropsInfoDto.id ) {
                throw new Error(this.tOutputPropsInfoNotValid);
            }

            const item : OutputPropValueDto = {
                id : op.outputPropsInfoDto?.id,
                value : op.control.value
            };

            outputPropValueList.push(item);
        }

        let request: GenericFileUploadDetailRequestPostDto = {
            categoria : selectedCategory?.value,
            dynamicFields : dynFlds,
            promptHint : promptHint?.value,
            outputProps : outputPropValueList,
            tag : etag,
            pagesFilter : pagesFilter?.value,
            filesDto: multipleFiles
        };

        return this.http.post<GenericFileUploadDetailResponsePostDto>(this.BASE_URL + '/GEN/FileUpload', request)
            .pipe(
                catchError(this.handleError.bind(this))
            );
    }
}

