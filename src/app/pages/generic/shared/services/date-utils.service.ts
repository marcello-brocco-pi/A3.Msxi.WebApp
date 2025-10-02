import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  constructor() { }

  public jsonDateToDate(value : string | null) : Date | null {
    let res : Date | null = null;

    try {
      if (value) {
        const dtValue= new Date(value);
        res = new Date(dtValue.getFullYear(), dtValue.getMonth(), dtValue.getDate());
      }
    } catch (error) {
      res = null;
    }

    return res;
  }

  public getISODateWithTZFromDateObject( value : Date | null) {
    let res : string = '';
    if (value) {
      //res = new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toJSON();
      res = value.toISOString();
    }
    return res;
  }

  public getDateObjectFromIsoDate( value : any | null) {
    let res : Date | null = null;
    if (value) {
      const stringLastImportedDate = <string>(<any>value);
      res = new Date(stringLastImportedDate);
    }
    return res;
  }

  public getDateObjectFromNgbDate(value : Date | null) : Date | null{
    let res : Date | null = null;
    if (value) {
      res= new Date(value.getFullYear(), value.getMonth()+1, value.getDate());
    }

    return res;
  }

  public getDateStringFromNgbDate(value : Date | null)  : string | null{
    let cDate = this.getDateObjectFromNgbDate(value)
    return cDate ? cDate.toISOString().split('T')[0] : null;
  }

  public getNgbToday() : Date {
    let d = new Date();
    return new Date(d.getFullYear(), d.getMonth()+1, d.getDate());
  }

  public getNgbFromDateObject(date : Date) : Date {

    return new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
  }

  public validateNgbDateRange(dtNgbFrom: Date | null, dtNgbTo: Date | null) : boolean{
    let res = true;

    if(dtNgbFrom == null && dtNgbTo == null){
      res = true;
    }
    else if(dtNgbFrom == null && dtNgbTo != null){
      res = false;
    }
    else{

      if(dtNgbFrom != null && dtNgbTo == null){
        dtNgbTo = dtNgbFrom;
      }

      let dtFrom = Date.parse(this.getDateObjectFromNgbDate(dtNgbFrom)!.toDateString());
      let dtTo = Date.parse(this.getDateObjectFromNgbDate(dtNgbTo)!.toDateString());

      if(dtFrom == null || Number.isNaN(dtFrom) || dtFrom <= 0){
        res = false;
      }
      else if(dtTo == null || Number.isNaN(dtTo) || dtTo <= 0){
        res = false;
      }
      else if(dtTo < dtFrom){
        res = false;
      }

    }

    return res;
  }

  public dateItaToIsoDateString(dateString: string): string | null {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    if (!day || !month || !year) {
        return null; // Invalid date format
    }
    let d =  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return d;
  }

  public dateIsoToItaDateString(dateStr: string | null | undefined): string {
    if (!dateStr){
      return '';
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '';
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

}
