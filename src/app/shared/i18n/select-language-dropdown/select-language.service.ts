import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNG } from 'primeng/config';

@Injectable({
    providedIn: 'root'
})
export class SelectLanguageService {
    public static readonly itLocale = 'it';
    public static readonly enLocale = 'en';
    public languages : LanguageItem[] = [
        { code: 'it', name: 'Italiano', icon: 'fi fi-it' },
        { code: 'gb', name: 'English', icon: 'fi fi-gb' }
    ];
    

    // private config: PrimeNGConfig, 
    constructor(private translate : TranslateService){
    }
    

    public getSavedLanguageCodeOrDefault(): string {
        return localStorage.getItem('language') || 'it';    
    }

    public getLanguageItemFromCode(langCode : string) : LanguageItem | undefined {
        return this.languages.find(lang => lang.code == langCode);
    }

    public getFlagCodeFromLangCode(langCode: string): string {
        switch (langCode) {
            case 'it':
                return 'it';
            case 'en':
                return 'gb';
            default:
                return 'it';
        }
    }

    public getLangCodeFromFlagCode(flagCode: string): string {
        switch (flagCode) {
            case 'it':
                return 'it';
            case 'gb':
                return 'en';
            default:
                return 'it';
        }
    }

    public selectedLanguageChanged(item: LanguageItem) {
        const userLanguage = this.getLangCodeFromFlagCode(item.code);
        localStorage.setItem('language', userLanguage);
        this.translate.use(userLanguage);
    }
    
    // https://stackblitz.com/edit/primeng-calendar-demo-pcg29f?file=src%2Fapp%2Fapp.component.html
    public static getItaCalendarLocale(): import("primeng/api").Translation {    
                return {
                    startsWith: 'Inizia con',
                    dayNames: [ "domenica","lunedi","martedì","mercoledì","giovedì","venerdì","sabato" ],
                    dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
                    dayNamesMin: [ "D","L","M","M","G","V","S" ],
                    monthNames: [ "gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","seettembre","ottobre","novembre","dicembre" ],
                    monthNamesShort: [ "gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic" ],
                    today: 'Oggi',
                    clear: 'Pulisci'
                };
    }

    public static getEnCalendarLocale(): import("primeng/api").Translation {
        return {
                  startsWith: 'Starts with',
                  dayNames: [ "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday" ],
                  dayNamesShort: [ "Sun","Mon","Tue","Wed","Thu","Fri","Sat" ],
                  dayNamesMin: [ "S","M","T","W","T","F","S" ], 
                  monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
                  monthNamesShort: [ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" ],
                  today: 'Today',
                  clear: 'Clear'
        };
    }

    public static getDateFormatIta(): string {
        return 'dd/mm/yy';
    }

    public static getDateFormatEng(): string {
        return 'mm/dd/yy';
    }
    
}

export interface LanguageItem {
    code: string;
    name: string;
    icon: string;
}


 
