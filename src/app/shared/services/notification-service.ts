import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DocCubeHubMessageDto, UploadStatusNotifyDto } from '../../layout/models/upload-status-notify-dto.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private subjRemoteUploadStatusNotify = new Subject<UploadStatusNotifyDto>();
  public subjRemoteUploadStatusNotify$ = this.subjRemoteUploadStatusNotify.asObservable();
  private subjDocCubeHubMessage = new Subject<DocCubeHubMessageDto>();
  public subjDocCubeHubMessage$ = this.subjDocCubeHubMessage.asObservable();
  private subjFeUploadStatusNotify = new Subject<UploadStatusNotifyDto>();
  public subjFeUploadStatusNotify$ = this.subjFeUploadStatusNotify.asObservable();

  sendRemoteUploadStatusNotification(message: UploadStatusNotifyDto) {
    console.log('sendRemoteUploadStatusNotification done: ', message);
    this.subjRemoteUploadStatusNotify.next(message);
  }

  sendMessageFromRemoteUploader(message: DocCubeHubMessageDto) {
    if(message.isRemoteError) {
      this.subjDocCubeHubMessage.next(message);
    }
  }

  sendFeUploadStatusNotification(message: UploadStatusNotifyDto) {
    console.log('sendFeUploadStatusNotification done: ', message);
    this.subjFeUploadStatusNotify.next(message);
  }
}