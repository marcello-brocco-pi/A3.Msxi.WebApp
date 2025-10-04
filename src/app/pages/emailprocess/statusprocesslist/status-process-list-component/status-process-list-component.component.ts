import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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

@Component({
  selector: 'app-status-process-list-component',
  standalone: true,
    imports: [FormsModule, AccordionModule, ToggleSwitchModule, DatePickerModule, TranslateModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, InputIconModule, ToggleButtonModule],
  templateUrl: './status-process-list-component.component.html'
})
export class StatusProcessListComponentComponent {
  getEmailsFilterForm: FormGroup | null = null
  emailResults: SourceEmailResponseGetDto[] = [];
  
  onCloseAccordion() {
   
  }

  onOpenAccordion() {
   
  }

}
