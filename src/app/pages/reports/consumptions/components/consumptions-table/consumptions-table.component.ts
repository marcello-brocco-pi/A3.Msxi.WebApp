import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyConsumerMetricsRowDto } from '../../models/company-consumer-metrics-row-dto';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-consumptions-table',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './consumptions-table.component.html'
})
export class ConsumptionsTableComponent extends ComponentBaseComponent {

  @Input() items: CompanyConsumerMetricsRowDto[] | undefined = [];
  
  constructor(translate : TranslateService) { 
    super(translate);
  }

  protected override applyTranslation(): void {
      // Implement any translation logic here if needed
  }


}
