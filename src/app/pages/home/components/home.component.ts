import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DividerModule } from 'primeng/divider';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { Router } from '@angular/router';
import { HomePageCardType } from '../../../shared/HomePageCards/home-page-card-type';
import { HomeCardComponent } from "./home-card.component";
import { PrimeNG } from 'primeng/config';
import { LanguageItem, SelectLanguageService } from '../../../shared/component/select-language-dropdown/select-language.service';
import { CompanyInfo } from '../../../core/services/auth/models/auth-response-get-dto.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TranslateModule, DividerModule, HomeCardComponent],
    templateUrl: './home.component.html',
})
export class Home extends ComponentBaseComponent implements OnInit, OnDestroy {
    @Input()
    public selectedCompany: CompanyInfo | null = null;
    public companiesForUser : CompanyInfo[] | null = null; 
    private selectedCompanyChangedSubscription: Subscription | null = null;
    public homePageCardType : any = HomePageCardType;

    public tEmailProcessManagement : string = '';
    public tEmailStatusProcess : string = '';
    private lngSet : LanguageItem = { code: 'gb', name: 'English', icon: 'fi fi-gb' };

    constructor(translate: TranslateService, private auth: AuthService, private layoutService: LayoutService, 
        private router : Router, primeNGConfig: PrimeNG, private selectLanguageService: SelectLanguageService) {
        super(translate, primeNGConfig);
        
    }

    protected override applyTranslation(): void {
        this.tEmailProcessManagement = this.translate.instant('Gestione Processo Email');
        this.tEmailStatusProcess = this.translate.instant('Lista Stato Processi');
    }

    override ngOnInit() {
        super.ngOnInit();
        // Impostiamo su English di default
        this.selectLanguageService.selectedLanguageChanged(this.lngSet);

        this.layoutService.layoutState.update(actualState => ({
            ...actualState,
            sidebarVisible: false
        }));

        // this.companiesForUser = this.auth.userInfo?.companies || null;
        // this.selectedCompany = this.auth.selectedCompany;
        // this.selectedCompanyChangedSubscription = this.auth.selectedCompanyChanged.subscribe((company: CompanyInfo) => {
        //     this.selectedCompany = company;
        // });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        // if (this.selectedCompanyChangedSubscription) {
        //     this.selectedCompanyChangedSubscription.unsubscribe();
        //     this.selectedCompanyChangedSubscription = null;
        // }
    }

    public isInRole(roles: string): boolean {
        return this.auth.isInRole(roles);
    }

    public isCompanySelected(): boolean {
        return this.auth.selectedCompany != null;
    }

}
