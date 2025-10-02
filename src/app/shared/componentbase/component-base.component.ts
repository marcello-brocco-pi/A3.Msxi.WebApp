import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PrimeNG } from 'primeng/config';
import { SelectLanguageService } from '../i18n/select-language-dropdown/select-language.service';

@Component({
  selector: 'app-ComponentBase',
  template:''
})
export abstract class ComponentBaseComponent implements OnInit, OnDestroy {
  public translate: TranslateService;
  private tSubscription?: Subscription;
  public localeDateFormat: string = SelectLanguageService.getDateFormatIta();
  
  constructor(translate : TranslateService, private primeNGConfig ? : PrimeNG | null) { 
    this.translate = translate;
    
  }

  ngOnInit(): void {
    this.applyTranslation();

    this.tSubscription = this.translate.onLangChange.subscribe(() => {
        this.applyTranslation();
        if(this.primeNGConfig != null){
          if(this.translate.store.currentLang === SelectLanguageService.itLocale){
            this.primeNGConfig.setTranslation(SelectLanguageService.getItaCalendarLocale());
            this.localeDateFormat = SelectLanguageService.getDateFormatIta();
          }
          else if(this.translate.store.currentLang === SelectLanguageService.enLocale){
              this.primeNGConfig.setTranslation(SelectLanguageService.getEnCalendarLocale());
              this.localeDateFormat = SelectLanguageService.getDateFormatEng();
          }
        }        
    });
  }

  ngOnDestroy(): void {
    this.tSubscription?.unsubscribe();
  }

  protected abstract applyTranslation() : void;

}
