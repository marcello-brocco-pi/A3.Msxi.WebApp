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
    private tUpload: string = '';
    private tArchivio: string = '';
    private tConsumi: string = '';
    private selectedCompanyChangedSubscription: Subscription | null = null;
    private selectedHomePageCardTypeChangedSubscription: Subscription | null = null;

    constructor(translate: TranslateService, private auth: AuthService, private layoutService: LayoutService) {
        super(translate);

    }

    protected override applyTranslation(): void {
        this.tPaginaPrincipale = this.translate.instant('Pagina principale');
        this.tGestioneFlotta = this.translate.instant('Gestione Flotta');
        this.tCaricaFile = this.translate.instant('Carica file');
        this.tStatoImport = this.translate.instant('Stato import');
        this.tUpload = this.translate.instant('Upload');
        this.tArchivio = this.translate.instant('Archivio');
        this.tConsumi = this.translate.instant('Consumi');

        this.loadMenuItems();
    }

    public isInRole(roles: string): boolean {
        return this.auth.isInRole(roles);
    }

    override ngOnInit() {
        super.ngOnInit();

       
        this.loadMenuItems();
        
        this.selectedCompanyChangedSubscription = this.auth.selectedCompanyChanged.subscribe((company: CompanyInfo) => {
            this.selectedCompany = company;
            this.loadMenuItems();
        });
        
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
                label: this.tGestioneFlotta,
                icon: 'pi pi-fw pi-car',
                items: [
                    {
                        label: this.tCaricaFile,
                        icon: 'pi pi-fw pi-file-plus',
                        routerLink: ['/'],
                        visible: this.isInRole('RGFileUploadFullAccess')
                    },
                    { 
                        label: this.tStatoImport, 
                        icon: 'pi pi-fw pi-inbox', 
                        routerLink: ['/'],
                        visible: this.isInRole('RGFileUploadFullAccess')
                    }
                ],
                visible: ((companiesForUser?.length == 1 || this.selectedCompany?.id == 1) && this.isInRole('RGFileUploadFullAccess'))
            },
            {
                label: 'SmartDocs',
                icon: 'pi pi-fw pi-folder-plus',
                visible: (
                            (this.layoutService.selectedHomePageCardType === HomePageCardType.FileUpload) &&
                            ((companiesForUser?.length == 1 || this.selectedCompany!=null ) && (this.isInRole('ClassifierUploadFullAccess,GenericFileUploadFullAccess')))
                        ),
                items: [
                    { 
                        label: this.tUpload, 
                        icon: 'pi pi-fw pi-file-plus', 
                        routerLink: ['/fileupload'],
                        visible: this.isInRole('ClassifierUploadFullAccess,GenericFileUploadFullAccess')
                    },
                    { 
                        label: this.tArchivio,
                        icon: 'pi pi-fw pi-inbox', 
                        routerLink: ['/importstatus'],
                        visible: this.isInRole('GENImportStatusFullAccess,GENImportStatusOperator,GENImportStatusAdmin')
                    }
                ]
            },
            {
                label: 'ChatCube',
                icon: 'pi pi-fw pi-comments',
                visible: (
                            (this.layoutService.selectedHomePageCardType === HomePageCardType.ChatBotRag) &&
                            ((companiesForUser?.length == 1 || this.selectedCompany?.id==3) && ( this.isInRole('ChatAIRAGOperator,ChatAIRAGFullAccess')))
                        ),
                items: [
                    {
                        label: 'Chat',
                        icon: 'pi pi-fw pi-comment',
                        routerLink: ['/chatbotairag'],
                        visible: this.isInRole('ChatAIRAGOperator,ChatAIRAGFullAccess')
                    },
                ]
            },
            {
                label: 'Reports',
                icon: 'pi pi-fw pi-chart-line',
                visible: (
                        (this.layoutService.selectedHomePageCardType === HomePageCardType.Reports) &&
                        (this.isInRole('MetricsFullAccess,QuotaFullAccess'))
                    ),
                items: [
                    {
                        label: this.tConsumi,
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/consumptions'],
                        visible: this.isInRole('MetricsFullAccess,QuotaFullAccess')
                    },
                ]
            },
        ];
    };
}
