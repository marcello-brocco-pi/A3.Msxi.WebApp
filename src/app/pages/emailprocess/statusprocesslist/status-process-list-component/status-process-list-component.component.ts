import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableLazyLoadEvent, TableModule, TablePageEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeNG } from 'primeng/config';
import { AccordionModule } from 'primeng/accordion';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { TabsModule } from 'primeng/tabs';
import { SourceEmailResponseGetDto } from '../../models/SourceEmailResponseGetDto';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { EmailProcessService } from '../../../services/email-process.service';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { GenericDropdownUploadedFilesComponent } from "../../../../shared/component/dropdown-uploaded-files.component";

@Component({
  selector: 'app-status-process-list-component',
  standalone: true,
    imports: [FormsModule, AccordionModule, ToggleSwitchModule, DatePickerModule, TranslateModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, InputIconModule, ToggleButtonModule, Tag, GenericDropdownUploadedFilesComponent],
  templateUrl: './status-process-list-component.component.html'
})
export class StatusProcessListComponentComponent  extends ComponentBaseComponent implements OnInit  {

  tDaElaborare : string = '';
  getEmailsFilterForm: FormGroup | null = null
  emailResults: SourceEmailResponseGetDto[] = [];
  isLoadingTable: boolean = false;

  constructor(private primengConfig: PrimeNG, translate : TranslateService, private emailProcessService: EmailProcessService) { 
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
    this.tDaElaborare = this.translate.instant('Da elaborare');
  }
    
  override ngOnInit() {
      super.ngOnInit();  
      this.createFilterForm();
      //this.loadData();
  }

  onCloseAccordion() {
   
  }

  onOpenAccordion() {
   
  }

   private createFilterForm() {
      this.getEmailsFilterForm = new FormGroup({
      });
  }


  onExecuteClick() {
    this.isLoadingTable = true;
    this.emailResults = [];
    this.emailProcessService.getAll().subscribe({
      next: (data) => {
        this.emailResults = data;
        this.isLoadingTable = false;
      },
      error: () => {
        this.isLoadingTable = false;

      }
    });
  }

  onClickDetail(rowItem: SourceEmailResponseGetDto) {
    alert('Dettaglio Email: ' + rowItem.id);
  }

  
  getRecordStateTooltip(rowData: SourceEmailResponseGetDto) : string {
    return '';
  }
  
  getTagClassForState(state: number): string {
    let classNames = '';
    switch (state) {
      case 0:
        classNames = `info`;
        break;
      case 1:
        classNames = `info`;
        break;
      case 2:
        classNames = `danger`;
        break;
      case 3:
        classNames = `warn`;
        break;
      case 4:
        classNames = `success`;
        break;
      case 5:
        classNames = `info`;
        break;
      case 6:
        classNames = `contrast`;
        break;
      case 7:
        classNames = `secondary`;
        break;
      default:
        break;
    }
    return classNames;
  }

  getLabelForState(state: number): string {
    return this.tDaElaborare;
  }
}
