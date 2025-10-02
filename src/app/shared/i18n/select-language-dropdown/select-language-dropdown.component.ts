import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { LanguageItem, SelectLanguageService } from './select-language.service';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
    selector: 'app-selectlanguagedropdown',
    standalone: true,
    providers: [MessageService],
    template: `
        
        @if (location == 'home') {
        <p-menu #menuHome [model]="items" [popup]="true" appendTo="body" />
        <p-button (onClick)="menuHome.toggle($event)" [severity]="'secondary'" [rounded]="true" [icon]="selectedLanguageItem?.icon"/>
        }
        @if (location == 'top') {
        <p-menu #menu [model]="items" [popup]="true" />
        <p-button (onClick)="menu.toggle($event)" [severity]="'secondary'" [rounded]="true" [icon]="selectedLanguageItem?.icon"/>
        }`,
    imports: [ToastModule, MenuModule, ButtonModule]
})
export class SelectLanguageDropDownComponent implements OnInit {

    @Input() public location?: 'home' | 'top' ;

    public selectedLanguageItem? : LanguageItem;
    public items : MenuItem[] =[];


    constructor(private translate: TranslateService, private selectLanguageService: SelectLanguageService) { 
        for (const lang of this.selectLanguageService.languages) {
           this.items.push({
                label: lang.name,
                icon: lang.icon,
                command: () => {
                    this.selectedLanguageChanged(lang);
                }
            });
        }
    }

    ngOnInit() {
        const userLanguage = this.selectLanguageService.getSavedLanguageCodeOrDefault();
        this.selectedLanguageItem = this.selectLanguageService.getLanguageItemFromCode(this.selectLanguageService.getFlagCodeFromLangCode(userLanguage));
    }

    public selectedLanguageChanged(item: LanguageItem) {
        this.selectedLanguageItem = item;
        this.selectLanguageService.selectedLanguageChanged(item);
    }

}
