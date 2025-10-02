import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../../shared/services/service-base.service';
import { ImportStatusFilterResponseGetDto } from '../models/ImportStatusFilterResponseGetDto.models';
import { EDonwloadFormat } from '../../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { ImportStatusRequestGetDto } from '../models/ImportStatusRequestGetDto.model';
import { ImportStatusResponseGetDto } from '../models/ImportStatusResponseGetDto.model';
import { DateUtilsService } from '../../shared/services/date-utils.service';
import { LogGenWorkflowStepsRequestGetDto, LogGenWorkflowStepsResponseGetDto } from '../components/log-gen-modal-content/models/LogGenWorkflowStepDto.model';

@Injectable({
  providedIn: 'root'
})
export class GenImportStatusService extends ServiceBaseService {
  private tDaElaborare! : string;
  private tInElaborazione! : string;
  private tInErrore! : string;
  private tElaborataConWarning! : string;
  private tElaborataConSuccesso! : string;
  private tInAnteprima! : string;
  private tCancellataDaUtente! : string;
  private tSalvata! : string;

  constructor(private http: HttpClient, private dateUtilsService: DateUtilsService, translate : TranslateService) {
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
   this.tDaElaborare = this.translate.instant('Da elaborare');
    this.tInElaborazione = this.translate.instant('In elaborazione');
    this.tInErrore = this.translate.instant('In errore');
    this.tElaborataConWarning = this.translate.instant('Elaborata con warning');
    this.tElaborataConSuccesso = this.translate.instant('Successo');
    this.tInAnteprima = this.translate.instant('In anteprima');
    this.tCancellataDaUtente = this.translate.instant('Annullata');
    this.tSalvata = this.translate.instant('Salvata');
  }

  public getImportStatusFilters(companyId : number): Observable<ImportStatusFilterResponseGetDto> {
    let params = new HttpParams()
      .append("companyId", companyId ?? '')

    return this.http.get<ImportStatusFilterResponseGetDto>(this.BASE_URL + '/GEN/ImportStatus/Filters', { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public downloadAttach(fileName : string, filePath:string, direction: string, format:EDonwloadFormat): Observable<any> {
    let url = `${this.BASE_URL}/GEN/DocumentAnalysisAttachments/${fileName}?filePath=${filePath}&direction=${direction}&format=${format}`;
    return this.http.get(url,{ observe: 'response', responseType: 'blob' as 'json' })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  downloadZippedDirS3(fileName: string): Observable<any> {
    let url = `${this.BASE_URL}/GEN/ImportStatus/byFile/${fileName}/LogFiles/zip`;
    return this.http.get(url,{ observe: 'response', responseType: 'blob' as 'json' })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public getImportStatus(request: ImportStatusRequestGetDto): Observable<ImportStatusResponseGetDto> {

    if (request.dataTableInfo?.sortInfo?.prop) {
      request.dataTableInfo.sortInfo.prop = request.dataTableInfo?.sortInfo?.prop?.replace("dataInserimento","Created")
      .replace("stato","Status")
      .replace("categoria","Categoria.Name");
    }

    let params = this.getImportStatusParameters(request);

    return this.http.get<ImportStatusResponseGetDto>(this.BASE_URL + '/GEN/ImportStatus', { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public getImportStatusReports(request: ImportStatusRequestGetDto, url:string, reportType:number): Observable<any> {
    let params = this.getImportStatusParameters(request);
    params = params.append("reportType", reportType.toString());
    return this.http.get(this.BASE_URL + '/GEN/ImportStatusReports/' + url,{ params: params, observe: 'response', responseType: 'blob' as 'json' })
    .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private getImportStatusParameters(request: ImportStatusRequestGetDto): HttpParams {
    let params = new HttpParams()
    .append("companyId", request.companyId ?? '')
    .append("operatore", request.operatore ?? '')
    .append("dataInsDa", this.dateUtilsService.getISODateWithTZFromDateObject(<Date | null>request.dataInsDa))
    .append("dataInsA", this.dateUtilsService.getISODateWithTZFromDateObject(<Date | null>request.dataInsA))
    .append("esito", request.esito ?? '')
    .append("categoria", request.categoria ?? '')
    .append("nomeAllegato", request.nomeAllegato ?? '')
    .append("responseLike", request.responseLike ?? '')
    .append("rawTextLike", request.rawTextLike ?? '')
    .append("configPropName", request.configPropName ?? '')
    .append("configPropValue", request.configPropValue ?? '')
    .append("dataTableInfo.sortInfo.dir", request.dataTableInfo?.sortInfo?.dir??'')
    .append("dataTableInfo.sortInfo.prop", request.dataTableInfo?.sortInfo?.prop??'')
    .append("dataTableInfo.pageInfo.size", request.dataTableInfo?.pageInfo.size ?? '')
    .append("dataTableInfo.pageInfo.totalElements", request.dataTableInfo?.pageInfo.totalElements ?? '')
    .append("dataTableInfo.pageInfo.pageNumber", request.dataTableInfo?.pageInfo.pageNumber ?? '')
    .append("dataTableInfo.pageInfo.totalPages", request.dataTableInfo?.pageInfo.totalPages ?? '')
    .append("jsonStringDynFilterFields", JSON.stringify(request.dynFilterFields));

    return params;
  }      

  
  public getRowClassForState(state: number): string {
    let classNames = '';
    switch (state) {
      case 0:
        classNames = 'bi-hourglass-split text-secondary';
        break;
      case 1:
        classNames = 'bi-arrow-clockwise text-primary';
        break;
      case 2:
        classNames = 'bi-x-circle text-danger';
        break;
      case 3:
        classNames = 'bi-exclamation-triangle text-warning';
        break;
      case 4:
        classNames = 'bi-check-square text-success';
        break;
      case 5:
        classNames = 'bi bi-zoom-in text-primary';
        break;
      case 6:
        classNames = 'bi bi-sign-stop-fill text-primary';
        break;
      case 7:
          classNames = 'bi bi-save text-primary';
          break;
      default:
        break;
    }
    return classNames;
  }

  getLogGenWorkflowSteps(id:number, request: LogGenWorkflowStepsRequestGetDto) : Observable<LogGenWorkflowStepsResponseGetDto> {
    let params = new HttpParams()
    .append("dataTableInfo.sortInfo.dir", request.dataTableInfo?.sortInfo?.dir??'')
    .append("dataTableInfo.sortInfo.prop", request.dataTableInfo?.sortInfo?.prop??'')
    .append("dataTableInfo.pageInfo.size", request.dataTableInfo?.pageInfo.size ?? '')
    .append("dataTableInfo.pageInfo.totalElements", request.dataTableInfo?.pageInfo.totalElements ?? '')
    .append("dataTableInfo.pageInfo.pageNumber", request.dataTableInfo?.pageInfo.pageNumber ?? '')
    .append("dataTableInfo.pageInfo.totalPages", request.dataTableInfo?.pageInfo.totalPages ?? '')

    return this.http.get<LogGenWorkflowStepsResponseGetDto>(`${this.BASE_URL}/GEN/ImportStatus/${id.toString()}/LogGenWorkflowSteps`, { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getTagClassForState(state: number): string {
    let classNames = '';
    switch (state) {
      case 0:
        classNames = `info`;
        break;
      case 1:
        classNames = `info`;
        break;
      case 2:
        classNames = `danger`;
        break;
      case 3:
        classNames = `warn`;
        break;
      case 4:
        classNames = `success`;
        break;
      case 5:
        classNames = `info`;
        break;
      case 6:
        classNames = `contrast`;
        break;
      case 7:
        classNames = `secondary`;
        break;
      default:
        break;
    }
    return classNames;
  }

  getLabelForState(state: number): string {
    let tooltip = '';
    switch (state) {
      case 0:
        tooltip = this.tDaElaborare;
        break;
      case 1:
        tooltip = this.tInElaborazione;
        break;
      case 2:
        tooltip = this.tInErrore;
        break;
      case 3:
        tooltip = this.tElaborataConWarning;
        break;
      case 4:
        tooltip = this.tElaborataConSuccesso;
        break;
      case 5:
          tooltip = this.tInAnteprima;
          break;
      case 6:
        tooltip = this.tCancellataDaUtente;
        break;
      case 7:
          tooltip = this.tSalvata;
          break;
      default:
        break;
    }
    return tooltip;
  }

}
