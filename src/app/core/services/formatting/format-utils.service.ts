import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../shared/services/service-base.service';


@Injectable({
  providedIn: 'root'
})
export class FormatTextUtils extends ServiceBaseService {
  private tNoresults! : string;
  private tNoConvert! : string;
  

  constructor(translate : TranslateService) { 
    super(translate);
    
  }
  override applyTranslation() {
    this.tNoresults = this.translate.instant("Nessun risultato ottenuto dall'elaborazione.");
    this.tNoConvert = this.translate.instant("Non è stato possibile convertire il risultato in formato JSON:");
    
  }

  public getHTMLFromJSONObj(obj: any) {
    if (!obj) {
      return this.tNoresults;
    }
    var res: string;

    try {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      res = JSON.stringify(obj, null, 3)
        .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(jsonLine, this.replacerForJSONToHTML);
    } catch (error) {
      res = this.tNoConvert + " " + obj;
    }

    return res;
  }

  public getJSONObjFromStr(source: string): any {
    let res = "{}";
    try {
      res = JSON.parse(source);
    } catch (error) {
      res = this.tNoConvert + " " + source
    }
    return res;
  }

  public replaceTextLFToBR(source: string): string {
    let res = "";
    if (source) {
      res = source.replaceAll('\n', '<br/>');
    }
    return res;
  }

  private replacerForJSONToHTML(match: any, pIndent: any, pKey: any, pVal: any, pEnd: any) {
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
