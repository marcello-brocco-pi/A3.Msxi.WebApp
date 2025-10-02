import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ComponentBaseComponent } from '../../componentbase/component-base.component';
import { TranslateService } from '@ngx-translate/core';
import { UploadStatusNotifyDto } from '../../../layout/models/upload-status-notify-dto.model';
import { NotificationService } from '../../services/notification-service';
import { ProgressBar } from 'primeng/progressbar';


@Component({
  selector: 'app-fe-notify',
  imports: [Toast, ProgressBar],
  templateUrl: './fe-notify.component.html',
  providers: [MessageService]
})
export class FeNotifyComponent  extends ComponentBaseComponent implements OnInit {
  private tSubFeMsg?: Subscription;
  showProgress: boolean = false;

  constructor(private notificationService: NotificationService, private messageService: MessageService, translate: TranslateService) {
    super(translate);
  }

  override applyTranslation(): void {

  }

  override ngOnInit(): void {
    super.ngOnInit();       
    this.tSubFeMsg = this.notificationService.subjFeUploadStatusNotify$.subscribe((message: UploadStatusNotifyDto) => {
      let life = 0;
      let detail = '';
      if(message.status === 'DA_ELABORARE'){
          life = 8000;
          this.showProgress = true;
          detail = `Elaborazione in corso...`;
      }
      else {
          life = 6000;
          this.showProgress = false;
          detail = `File ${message.fileName} in elaborazione.`;
      }

      this.showToast(message.fileName, life, detail);
    });
  }

  private showToast(fileName: string, life : number, detail: string) {
    this.messageService.add({ severity: 'info', summary: 'File Upload', detail: detail, life: life  });
  }
}
