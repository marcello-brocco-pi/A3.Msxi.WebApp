import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {TableModule, TablePageEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabsModule } from 'primeng/tabs';
import { EProcessStatus, SourceEmailDto } from '../models/source-email-dto';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { EmailProcessService } from '../../services/email-process.service';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { GenericDropdownUploadedFilesComponent } from "../../../shared/component/dropdown-uploaded-files.component";
import { Router } from '@angular/router';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { DropdownValueDescDto } from '../../../core/models/dropdown-value-desc-dto.model';
import { IconFieldModule } from 'primeng/iconfield';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NewRequestDialogComponent } from "../new-request-dialog/new-request-dialog.component";

@Component({
  selector: 'app-status-process-list-component',
  standalone: true,
    imports: [FormsModule, AccordionModule, ToggleSwitchModule, DatePickerModule, TranslateModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, IconFieldModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, InputIconModule, ToggleButtonModule, Tag, GenericDropdownUploadedFilesComponent, NewRequestDialogComponent],
  templateUrl: './status-process-list-component.html'
})
export class StatusProcessListComponent  extends ComponentBaseComponent implements OnInit  {      
  public EProcessStatus = EProcessStatus;
  getEmailsFilterForm: FormGroup | null = null;
  emailResults: SourceEmailDto[] = [];
  isLoadingTable: boolean = false;
  statusList: DropdownValueDescDto[] = [];
  statusId: number = 0;
  showPromptDialog: boolean = false;
  kbHubSourceSyncId: number = 0;

  constructor(private authService: AuthService, translate : TranslateService,
    private emailProcessService: EmailProcessService, private router: Router,private modalMessageService : ModalMessageService,
      private chg : ChangeDetectorRef) { 
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
  }
    
  override ngOnInit() {
      super.ngOnInit();  
      this.createFilterForm();
      this.loadStatusList();
      this.onExecuteClick();
      this.kbHubSourceSyncId = this.authService.userInfo?.companies?.[0]?.id ?? 0;
  }

  onDialogExecuteClick() {
      this.onExecuteClick();
  }

  get statusObj() {
      return this.getEmailsFilterForm?.get('statusObj');
  }

  loadStatusList() {
      let n : number = EProcessStatus.Unprocessed;
      this.statusList.push({ id: null, description: this.translate.instant('Tutti')});
      this.statusList.push({ id: n.toString(), description: this.getLabelForState(EProcessStatus.Unprocessed) });
      n = EProcessStatus.Processed;
      this.statusList.push({ id: n.toString(), description: this.getLabelForState(EProcessStatus.Processed) });
      n = EProcessStatus.InReview;
      this.statusList.push({ id: n.toString(), description: this.getLabelForState(EProcessStatus.InReview) });
      n = EProcessStatus.Finalizing;
      this.statusList.push({ id: n.toString(), description: this.getLabelForState(EProcessStatus.Finalizing) });
  }

  onCloseAccordion() {
   
  }

  onOpenAccordion() {
   
  }

  private createFilterForm() {
    this.getEmailsFilterForm = new FormGroup({
      status: new FormControl<number | null>(null),
      statusObj: new FormControl<DropdownValueDescDto[] | null>(null),
    });
  }

  onExecuteClick() {
    this.isLoadingTable = true;
    this.emailResults = [];
    this.getEmailsFilterForm?.disable();
    this.emailProcessService.getAll(this.statusId ?? 0, this.authService.userInfo?.email ?? 'unknown').subscribe({
      next: (data) => {
        this.emailResults = data;
        this.isLoadingTable = false;
        this.getEmailsFilterForm?.enable();
      },
      error: (err) => {
        this.isLoadingTable = false;
        this.getEmailsFilterForm?.enable();
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
      }
    });
  }

  onClickDetail(id: number) {
    this.router.navigate(['emailprocessdetail', id], { queryParams: { kbHubSourceSyncId: this.kbHubSourceSyncId } });
  }
  
  getRecordStateTooltip(rowData: SourceEmailDto) : string {
    return '';
  }
  
  getTagClassForState(state: EProcessStatus): string {
    let classNames = '';
    switch (state) {
      case EProcessStatus.Unprocessed:
        classNames = `danger`;
        break;
      case EProcessStatus.Processed :
        classNames = `info`;
        break;
      case EProcessStatus.InReview:
        classNames = `info`;
        break;
      case EProcessStatus.Finalizing:
        classNames = `info`;
        break;
      case EProcessStatus.Completed:
        classNames = `success`;
        break;
      case EProcessStatus.CompletedWithIssues:
        classNames = `warning`;
        break;
      default:
        break;
    }
    return classNames;
  }

  getLabelForState(state: EProcessStatus): string {
    let label = '';
    switch (state) {
      case EProcessStatus.Unprocessed:
        label = this.translate.instant('Da elaborare');
        break;
      case EProcessStatus.Processed:
        label = this.translate.instant('Elaborata');
        break;
      case EProcessStatus.InReview:
        label = this.translate.instant('In revisione');
        break;
      case EProcessStatus.Finalizing:
        label = this.translate.instant('In finalizzazione');
        break;
      case EProcessStatus.Completed:
        label = this.translate.instant('Completata');
        break;
      case EProcessStatus.CompletedWithIssues:
        label = this.translate.instant('Completata!');
        break;
      default:
        label = this.translate.instant('Unknown');
        break;
    }
    return label;
  }

  onClickDelete(id: number) {       

    this.modalMessageService.showConfirm(this.modalMessageService.defaultConfirmMessage(), true, true)
    .subscribe((result: "accept" | "reject" | "cancel") => {
      if (result === "accept") {
          this.emailProcessService.delete(id).subscribe({ 
            next: () => {
              this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
              this.onExecuteClick();
            },
            error: (err: string) => {
              this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
            }
        });
      }
      else if (result === "reject") {
        
      }      
    }); 

  } 
  
  onStatusChange() {
    this.statusId = this.statusObj?.value.id;   
  }
  
  resetFilters() {
    this.statusObj?.setValue(0);
    this.onStatusChange();
    this.onExecuteClick()
  }

  openDialogNewEmailProcess() {
    this.showPromptDialog = false;
    this.chg.detectChanges();
    this.showPromptDialog = true;
    this.chg.detectChanges();
  }

  onRefreshList() {
    this.onExecuteClick();
  }
}