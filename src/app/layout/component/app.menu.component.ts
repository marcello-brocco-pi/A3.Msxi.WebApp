import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem.component';
import { CompanyInfo } from '../../core/models/company-info.model';
import { ComponentBaseComponent } from '../../shared/componentbase/component-base.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { HomePageCardType } from '../../shared/HomePageCards/home-page-card-type';
import { LayoutService } from '../service/layout.service';


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: './app.menu.component.html',
})
export class AppMenu extends ComponentBaseComponent implements OnInit, OnDestroy {

    @Input()
    public selectedCompany: CompanyInfo | null = null;

    public model: MenuItem[] = [];

    private tPaginaPrincipale: string = '';
    private tGestioneFlotta: string = '';
    private tCaricaFile: string = '';
    private tStatoImport: string = '';
    private tListProcess: string = '';
    private tArchivio: string = '';
    private tConsumi: string = '';
    private selectedCompanyChangedSubscription: Subscription | null = null;
    private selectedHomePageCardTypeChangedSubscription: Subscription | null = null;

    constructor(translate: TranslateService, private auth: AuthService, private layoutService: LayoutService) {
        super(translate);

    }

    protected override applyTranslation(): void {
        this.tPaginaPrincipale = this.translate.instant('Home');
        this.tListProcess = this.translate.instant('Lista Stato Processi');

        this.loadMenuItems();
    }

    public isInRole(roles: string): boolean {
        return this.auth.isInRole(roles);
    }

    override ngOnInit() {
        super.ngOnInit();

       
        this.loadMenuItems();
        
                
        this.selectedHomePageCardTypeChangedSubscription = this.layoutService.selectedHomePageCardTypeChanged.subscribe((cardType: HomePageCardType) => {
            this.layoutService.selectedHomePageCardType = cardType;
            this.loadMenuItems();
        });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (this.selectedCompanyChangedSubscription) {
            this.selectedCompanyChangedSubscription.unsubscribe();
            this.selectedCompanyChangedSubscription = null;
        }
        
        if (this.selectedHomePageCardTypeChangedSubscription) {
            this.selectedHomePageCardTypeChangedSubscription.unsubscribe();
            this.selectedHomePageCardTypeChangedSubscription = null;
        }
    }

    private loadMenuItems() {
        const companiesForUser = this.auth.userInfo?.companies;
        this.model = [
            {
                label: 'Home',
                items: [{ label: this.tPaginaPrincipale, icon: 'pi pi-fw pi-home', routerLink: ['/home'] }]
            },
            {
                label: 'MANAGEMENT',
                icon: 'pi pi-fw pi-folder-plus',
                visible: (
                           true
                        ),
                items: [
                    { 
                        label: this.tListProcess, 
                        icon: 'pi pi-fw pi-file-plus', 
                        routerLink: ['/statusprocesslist'],
                        visible: this.isInRole('ClassifierUploadFullAccess,GenericFileUploadFullAccess')
                    }
                ]
            },
        ];
    };
}
