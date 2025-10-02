import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';



@Component({
    selector: 'app-consumptions-counter',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './consumptions-counter.component.html'
})


export class ConsumptionsCounterComponent extends ComponentBaseComponent {


  @Input() title : string | null = null;
  @Input() value : number | null = null;
  @Input() icon : string | null = null;
  @Input() iconTitle : string | null = null;
  
  //@HostBinding('class') class = 'col-sm-6 col-lg-4 col-xl-3';
  
  constructor(translate : TranslateService) { 
    super(translate);
  }

  protected override applyTranslation(): void {
      // Implement any translation logic here if needed
  }


}
