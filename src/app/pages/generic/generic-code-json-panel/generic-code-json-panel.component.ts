import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GenericDropdownUploadedFilesComponent } from "../generic-dropdown-uploaded-files/generic-dropdown-uploaded-files.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';
import { LogGenFileManagerAttachmentDto } from '../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { AccordionModule } from 'primeng/accordion';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-generic-code-json-panel',
  standalone: true,
  imports: [TranslateModule, AccordionModule, FluidModule, GenericDropdownUploadedFilesComponent, PanelModule, ButtonModule],
  templateUrl: './generic-code-json-panel.component.html'
})
export class GenericCodeJsonPanelComponent extends ComponentBaseComponent implements OnInit, OnDestroy {
  @Input() pCodeJson: string = '';
  @Input() lstAttachmentDto: LogGenFileManagerAttachmentDto[] | null = [];
  private tNessunRisultato: string = '';
  private tNonPossibileConvertireJson: string = '';

  constructor(private generalUtilsService:GeneralUtilsService, translate : TranslateService) { 
    super(translate);
  }

  protected override applyTranslation(): void {
    this.tNessunRisultato = this.translate.instant("Nessun risultato ottenuto dall'elaborazione.");
    this.tNonPossibileConvertireJson = this.translate.instant("Non è stato possibile convertire il risultato in formato JSON:");
    
  }

  public downloadJson() {
    this.generalUtilsService.downloadAppJsonBlob(JSON.stringify(this.pCodeJson), 'output.json')
  }

  public prettyPrint(obj: any) {
    if (!obj) {
      return this.tNessunRisultato;
    }
    var res: string;

    try {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      res = JSON.stringify(obj, null, 3)
        .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(jsonLine, this.replacer);
    } catch (error) {
      res = this.tNonPossibileConvertireJson + " " + obj;
    }

    return res;
  }

  replacer(match: any, pIndent: any, pKey: any, pVal: any, pEnd: any) {
    var key = '<span class=json-key>';
    var val = '<span class=json-value>';
    var str = '<span class=json-string>';
    var r = pIndent || '';
    if (pKey)
      r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
    if (pVal)
      r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
    return r + (pEnd || '');
  }

}
