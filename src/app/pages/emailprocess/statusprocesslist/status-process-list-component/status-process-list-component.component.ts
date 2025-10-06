import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {TableModule, TablePageEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeNG } from 'primeng/config';
import { AccordionModule } from 'primeng/accordion';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabsModule } from 'primeng/tabs';
import { EProcessStatus, SourceEmailResponseGetDto } from '../../models/SourceEmailResponseGetDto';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { EmailProcessService } from '../../../services/email-process.service';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { GenericDropdownUploadedFilesComponent } from "../../../../shared/component/dropdown-uploaded-files.component";
import { Router } from '@angular/router';
import { ModalMessageService } from '../../../../shared/modal-message/modal-message.service';
import { DropdownValueDescDto } from '../../../../core/models/dropdown-value-desc-dto.model';

@Component({
  selector: 'app-status-process-list-component',
  standalone: true,
    imports: [FormsModule, AccordionModule, ToggleSwitchModule, DatePickerModule, TranslateModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, InputIconModule, ToggleButtonModule, Tag, GenericDropdownUploadedFilesComponent],
  templateUrl: './status-process-list-component.component.html'
})
export class StatusProcessListComponentComponent  extends ComponentBaseComponent implements OnInit  {
  getEmailsFilterForm: FormGroup | null = null
  emailResults: SourceEmailResponseGetDto[] = [];
  isLoadingTable: boolean = false;
  statusList: DropdownValueDescDto[] = [];
  statusId: number = 0;

  constructor(private primengConfig: PrimeNG, translate : TranslateService,
    private emailProcessService: EmailProcessService, private router: Router, private modalMessageService : ModalMessageService) { 
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
  }
    
  override ngOnInit() {
      super.ngOnInit();  
      this.createFilterForm();
      this.loadStatusList();
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
      n = EProcessStatus.Finalized;
      this.statusList.push({ id: n.toString(), description: this.getLabelForState(EProcessStatus.Finalized) });
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
    this.emailProcessService.getAll(this.statusId).subscribe({
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
    this.router.navigate(['/emailprocessdetail', id]);
  }

  
  getRecordStateTooltip(rowData: SourceEmailResponseGetDto) : string {
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
      case EProcessStatus.Finalized:
        classNames = `success`;
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
      case EProcessStatus.Finalized:
        label = this.translate.instant('Finalizzata');
        break;
      default:
        label = this.translate.instant('Unknown');
        break;
    }
    return label;
  }

  onClickDelete(id: number) {    
    this.modalMessageService.showConfirm(this.translate.instant("Confermi l'operazione?"), true, true), () => {
      this.emailProcessService.delete(id).subscribe({ 
        next: () => {
          this.emailResults = this.emailResults.filter(e => e.id !== id);
        },
        error: (err: string) => {
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        }
      });
    };    
  } 
  
  onStatusChange() {
    this.statusId = this.statusObj?.value.id;   
  }
  resetFilters() {
    this.statusObj?.setValue(null);
  }
}