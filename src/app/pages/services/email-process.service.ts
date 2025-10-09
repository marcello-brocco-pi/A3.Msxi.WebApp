import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../../shared/services/service-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DateUtilsService } from '../generic/shared/services/date-utils.service';
import { Observable, catchError } from 'rxjs';
import { EProcessStatus, PatchEmailRequestDto, PatchParagrahRequestDto, SourceEmailDto } from '../emailprocess/models/SourceEmailDto';

@Injectable({
  providedIn: 'root'
})

export class EmailProcessService  extends ServiceBaseService {
  emailManagement : string  = "EmailManagement";
  constructor(private http: HttpClient, private dateUtilsService: DateUtilsService, translate : TranslateService) {
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
    
  }

  public getAll(statusId: EProcessStatus, userEmail: string): Observable<SourceEmailDto[]> {
    let params = new HttpParams();
    params = params.append('status', statusId.toString());
    params = params.append('userEmail', userEmail);
    return this.http.get<SourceEmailDto[]>(`${this.BASE_URL}/${this.emailManagement}`, { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public getById(id: number): Observable<SourceEmailDto> {
    return this.http.get<SourceEmailDto>(`${this.BASE_URL}/${this.emailManagement}/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  
  public delete(id: number) {
    return this.http.delete(`${this.BASE_URL}/EmailManagement/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public patchParagraph(id: number, request: PatchParagrahRequestDto) {
    return this.http.patch(`${this.BASE_URL}/${this.emailManagement}/Paragraph/${id}`, request)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public patchEmail(emailId: number, request: PatchEmailRequestDto): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/${this.emailManagement}/${emailId}`, request)
      .pipe(
        catchError((error) => {
          // Optionally, you can log or transform the error here
          return this.handleError(error);
        })
      );
  }

  
  public createNewEmailRequest(request: SourceEmailDto): Observable<number> {
    return this.http.post<number>(`${this.BASE_URL}/${this.emailManagement}`, request)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
