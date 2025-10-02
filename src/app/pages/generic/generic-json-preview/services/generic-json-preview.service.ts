import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../../shared/services/service-base.service';
import { JsonPreviewPostDto } from '../models/JsonPreviewPostDto.model';
import { GenericFileUploadDetailResponsePostDto, JsonPreviewResponseDto, PreviewStateDto, PreviewStatusRequestDto, UpdateAttachmentRequestDto, UpdateAttachmentResponseDto } from '../../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';

@Injectable({
  providedIn: 'root'
})
export class GenericJsonPreviewService  extends ServiceBaseService {
  constructor(private http: HttpClient, translate : TranslateService) {
    super(translate);
  }

  protected override applyTranslation(): void {
    // Implement any translation logic here if needed
  }

  public updateJsonPreview(data : JsonPreviewPostDto){
    return this.http.patch<GenericFileUploadDetailResponsePostDto>(this.BASE_URL + '/GEN/FileUpload', data);
  }

  public getJsonPreview(id : number){    
    return this.http.get<JsonPreviewResponseDto>(`${this.BASE_URL}/GEN/FileUpload/${id}/JsonSavedPreview`);
  }

  public getPreviewStatus(id : number){    
    return this.http.get<PreviewStateDto>(`${this.BASE_URL}/GEN/FileUpload/${id}/GetPreviewStatus`);
  }

  public getUpdateStatus(requestId : string){    
    return this.http.get<PreviewStateDto>(`${this.BASE_URL}/GEN/FileUpload/${requestId}/GetUpdateStatus`);
  }

  public updateAttachment(data: UpdateAttachmentRequestDto) {
    return this.http.post<UpdateAttachmentResponseDto>(this.BASE_URL + '/GEN/FileUpload/UpdateAttachment', data);
  }

  public closePreview(requestId : string){    
      return this.http.patch(`${this.BASE_URL}/GEN/FileUpload/${requestId}/ClosePreview`, {});
  }

}
