import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';
import { CommonModule } from '@angular/common';
import { NumericIndicatorDto } from '../../models/numeric-indicator-dto';

@Component({
    selector: 'app-consumptions-counters-table',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './consumptions-counters-table.component.html'
})

export class ConsumptionsCountersTableComponent extends ComponentBaseComponent {

  @Input() items : NumericIndicatorDto[] | undefined = [];

  constructor(translate : TranslateService) { 
    super(translate);
  }

  protected override applyTranslation(): void {
      // Implement any translation logic here if needed
  }


}
