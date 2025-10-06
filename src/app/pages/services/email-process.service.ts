import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../../shared/services/service-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DateUtilsService } from '../generic/shared/services/date-utils.service';
import { Observable, catchError } from 'rxjs';
import { EProcessStatus, SourceEmailResponseGetDto } from '../emailprocess/models/SourceEmailResponseGetDto';

@Injectable({
  providedIn: 'root'
})
export class EmailProcessService  extends ServiceBaseService {

  constructor(private http: HttpClient, private dateUtilsService: DateUtilsService, translate : TranslateService) {
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
    
  }

  public getAll(statusId: EProcessStatus): Observable<SourceEmailResponseGetDto[]> {
    let params = new HttpParams();
    params = params.append('status', statusId.toString());
    return this.http.get<SourceEmailResponseGetDto[]>(this.BASE_URL + '/EmailManagement', { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public getById(id: number): Observable<SourceEmailResponseGetDto> {
    return this.http.get<SourceEmailResponseGetDto>(this.BASE_URL + '/EmailManagement/' + id)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  
  public delete(id: number) {
      return this.http.delete(this.BASE_URL + '/EmailManagement/' + id)
        .pipe(
          catchError(this.handleError.bind(this))
        );
  }
}
