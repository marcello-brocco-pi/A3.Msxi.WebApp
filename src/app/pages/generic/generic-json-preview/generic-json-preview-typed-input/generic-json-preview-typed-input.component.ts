import { Component, Input} from '@angular/core';
import { JsonFinderValuesPreviewBaseDto, JsonFinderValuesPreviewDto, StylePreviewDto } from '../models/JsonFinderValuesPreviewDto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { JsonPreviewResponseDto } from '../../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { DateUtilsService } from '../../shared/services/date-utils.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { DropdownValueDescDto } from '../../../../core/models/dropdown-value-desc-dto.model';
@Component({
  selector: 'app-generic-json-preview-typed-input',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule, InputTextModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './generic-json-preview-typed-input.component.html'
})


export class GenericJsonPreviewTypedInputComponent extends ComponentBaseComponent {
@Input() dataOutput : JsonFinderValuesPreviewDto[] | null = null;
@Input() dataInput: JsonPreviewResponseDto = {} as JsonPreviewResponseDto;
@Input() itemIdx: number = 0;
@Input() rowItem: JsonFinderValuesPreviewBaseDto = {} as JsonFinderValuesPreviewBaseDto;
@Input() isFormatColor: boolean = false;

  constructor(private dateUtilsService: DateUtilsService, translate: TranslateService) {
    super(translate);

    this.dataInput = {} as JsonPreviewResponseDto;
    this.dataOutput = null;
  }

  override applyTranslation(): void {
    // Add any translation logic here if needed
  }

  
  getInputStyle(style: string|null): { [klass: string]: any; }|null|undefined {
    let result: { [klass: string]: any; } = {};
    let formatStyle:StylePreviewDto = {} as StylePreviewDto;
    if(style){
      formatStyle = JSON.parse(style);
      result = {'text-align': formatStyle.inputStylePreviewDto?.textAlign ?? 'left',
                'font-size': formatStyle.inputStylePreviewDto?.fontSize ?? '',
                'font-weight': formatStyle.inputStylePreviewDto?.fontWeight ?? '',
                'font-style': formatStyle.inputStylePreviewDto?.fontStyle ?? '', 
                'color': formatStyle.inputStylePreviewDto?.textColor ?? '',
                'background-color': formatStyle.inputStylePreviewDto?.backgroudColor ?? ''};
    }
    return result;
  }

  formatColor(itemIdx: number) : string {
    if(!this.isFormatColor){
      return "";
    }
    let value = "";
    let css = "jsoneditor-preview-modified is-valid"
    let newItem = this.dataOutput![itemIdx];
    if(newItem.type === 'boolean'){
      let checkPrevValue = (newItem.prevValue += '').toLowerCase();
      let prevValue = (checkPrevValue === 'false' || checkPrevValue === '') ? false : true;
     
      let checkNewValue = newItem.newValue + '';
      let newValue = (checkNewValue.toLowerCase() === 'false' || checkNewValue === '') ? false : true;

      if(prevValue !== newValue){
        value = css;
      }
    }
    else if(newItem.prevValue !== newItem.newValue){
      value = css;
    }

    return value;
  }

  setPriorityField($event: Event,labelId: string) {
    if ($event.target) {
      let checked = ($event.target as HTMLInputElement).checked;
      this.dataOutput!.filter((item) => {
        if (item.label === labelId) {;
          item.required = checked;
        }
      });

      let idToCheck = 'Ck' + labelId;
      this.dataOutput!.filter((item) => {
        if (item.label === idToCheck) {;
          item.newValue = checked;
        }
      });

      if(checked){
        document.getElementById(labelId)?.focus();
      }
    }
  }

  isCheckedPriorityField(labelId: string) : boolean {
    let ret = false;
    let idToCheck = 'Ck' + labelId;
    this.dataOutput!.filter((item) => {
      if (item.label === idToCheck) { // Su initi il valore arriva come stringa
        ret = item.newValue === 'True' ? true : false;
      }
    });
    return ret;
  }

  isPriorityFieldChecked(labelId: string): boolean {
    let ret = false;
    let idToCheck = 'Ck' + labelId;
    this.dataOutput!.filter((item) => {
      if (item.label === idToCheck) {
        ret = item.newValue;
      }
    });
    return ret;
  }
  
  testKey(arg0: any) {
   
  }

  getDdStaticValues(staticValuesJson: string) : DropdownValueDescDto[] {
    let res : DropdownValueDescDto[] = [];
    if(staticValuesJson && staticValuesJson.length > 0){
      try {
        let staticValues = JSON.parse(staticValuesJson);
        if(staticValues && Array.isArray(staticValues)){
          res = staticValues.map((item: any) => {
            return { value: item.Value, description: item.Description };
          });
        }
      } catch (error) {
        console.error('Error parsing staticValuesJson:', error);
      }
    }
    return res; // Always return an array
  }

}