import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../../shared/services/service-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DateUtilsService } from '../generic/shared/services/date-utils.service';
import { Observable, catchError } from 'rxjs';
import { SourceEmailResponseGetDto } from '../emailprocess/models/SourceEmailResponseGetDto';

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

  public getAll(): Observable<SourceEmailResponseGetDto[]> {
    let params = new HttpParams();
    return this.http.get<SourceEmailResponseGetDto[]>(this.BASE_URL + '/EmailManagement', { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
