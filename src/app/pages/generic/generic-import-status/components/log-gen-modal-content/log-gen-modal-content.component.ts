import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LogGenWorkflowStepDto, LogGenWorkflowStepsResponseGetDto } from './models/LogGenWorkflowStepDto.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';
import { GenImportStatusService } from '../../services/generic-import-status.service';
import { ModalMessageService } from '../../../../../shared/modal-message/modal-message.service';
import { GeneralUtilsService } from '../../../../../shared/services/general-utils.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { DataTableInfo } from '../../../shared/models/DataTableModels/data-table-info';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-log-gen-modal-content',
    imports: [
      TranslateModule, FluidModule, ButtonModule,
      FormsModule, DialogModule, CommonModule, TooltipModule
  ],
  templateUrl: './log-gen-modal-content.component.html'
})

export class LogGenModalContentComponent extends ComponentBaseComponent implements OnInit{
  @Input() visible: boolean = false; // 0 means hidden, 1 means visible
  @Input() id: number = 0; // ID of the import status to fetch logs for
  isLoading: boolean = false;
  dataTableInfo = new DataTableInfo();
  logItems: LogGenWorkflowStepDto[] = [];
  
  constructor(private importStatusService: GenImportStatusService, private modalMessageService: ModalMessageService, private auth : AuthService,
    private generalUtilsService : GeneralUtilsService, translate: TranslateService,  private chc : ChangeDetectorRef) {
      super(translate);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    if (this.visible) {
       setTimeout(() =>{
        this.loadData();
      },10); 
      
    }
  }

  protected override applyTranslation(): void {
    //inserire qui eventuali traduzioni
  }

  public isInRole(roles: string): boolean {
    return this.auth.isInRole(roles);
  }

  public downloadBlob(content : string, name : string) {
    this.generalUtilsService.downloadTextPlainBlob(content, name);
  }

  loadData(){
    this.isLoading = true;
    this.logItems = [];
    const request = {
      dataTableInfo: this.dataTableInfo
    };
    this.importStatusService
    this.importStatusService.getLogGenWorkflowSteps(this.id, request).subscribe({
      next: (data: LogGenWorkflowStepsResponseGetDto) => {
        if (data) {
            //this.chc.detectChanges();
            this.logItems = data.items;
            this.chc.detectChanges();
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
      }
    });
  }

  public getRowClass(): string {
    return 'border-bottom-1-solid-gray';
  }

  public getRowClassForState(state: number): string {
    return this.importStatusService.getRowClassForState(state);
  }

  close() {
    this.visible = false;
  }

}
