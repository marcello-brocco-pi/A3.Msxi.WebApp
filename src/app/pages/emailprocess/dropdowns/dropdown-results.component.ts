import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownDataObject } from '../../../shared/models/dropdown-dataobject.dto';
import { EmailProcessService } from '../../services/email-process.service';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { ResultsDownloadRequestDto } from '../models/results-download-request-dto';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';

@Component({
  selector: 'app-dropdown-results',
  imports: [CommonModule, TranslateModule, FormsModule, SelectModule, ButtonModule, MultiSelectModule],
  templateUrl: './dropdown-results.component.html'
})
export class DropdownResultsComponent extends ComponentBaseComponent {
  @Input() isResultPowerPoint: boolean = false;
  @Input() isResultWord: boolean = false;
  @Input() emailId: number = -1;
  dataRows: DropdownDataObject[] = [];
  selectedRows: DropdownDataObject[] = [];


  constructor(translate: TranslateService, private emailProcessService: EmailProcessService,private modalMessageService: ModalMessageService,
      private generalUtilsService: GeneralUtilsService
  ) {
        super(translate);
  }

  protected override applyTranslation(): void {
  }

  override ngOnInit() {
      super.ngOnInit();
      this.dataRows = [];      
      if (this.isResultWord) {
          this.dataRows.push({name: "WordResultDoc", value: "1"});
      }
      if (this.isResultPowerPoint) {
          this.dataRows.push({name: "PowerPointResultDoc", value: "2"});
      }
      this.selectedRows = [];
    }

  downloadSelectedFiles(selectedRows: any[]) {
      if (selectedRows && selectedRows.length < 1) {
          this.modalMessageService.showError(this.modalMessageService.defaultSelectFileMessage());
          return;
      }
      let request: ResultsDownloadRequestDto = {
          isWord: false,
          isPowerPoint: false
      };
      this.emailProcessService.downloadProcessResults(this.emailId, request)
        .subscribe((response) => {
          this.saveAs(response);
      });
  }

   saveAs(response: any): void {
        if (response.body !== null) {
            this.generalUtilsService.downloadBlobType(response.body, response.body.type,
                this.generalUtilsService.getXFileNameFromRepsonse(response));
        }
        else {
            this.modalMessageService.showError(this.modalMessageService.defaultNoAttachsMessage())
        }
    }

}
