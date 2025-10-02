import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule, RoutesRecognized } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { AppConfigurator } from './app.configurator.component';
import { SelectLanguageDropDownComponent } from '../../shared/i18n/select-language-dropdown/select-language-dropdown.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../shared/componentbase/component-base.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';
import { SelectLanguageService } from '../../shared/i18n/select-language-dropdown/select-language.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CompanyInfo } from '../../core/models/company-info.model';
import { DialogModule } from 'primeng/dialog';
import { ChangePasswordComponent } from "../../pages/user-profile/components/change-password/change-password.component";


@Component({
    selector: 'app-topbar',
    standalone: true,    
    imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    SelectLanguageDropDownComponent,
    TranslateModule,
    SplitButtonModule,
    MenuModule,
    ButtonModule,
    TieredMenu,
    RouterModule,
    SelectModule,
    FormsModule, DialogModule,
    ChangePasswordComponent
],
    providers: [TranslateService, Router],
    templateUrl: './app.topbar.component.html',
})
export class AppTopbar extends ComponentBaseComponent implements OnInit     {

    @Input()
    public selectedCompany: CompanyInfo | null = null;
    @Input()
    public companiesForUser: CompanyInfo[] = [];
    public profileMenuItems: MenuItem[] = [];
    public smallMenuItems: MenuItem[];
    showChangePwd: boolean = false;

    constructor(
        public layoutService: LayoutService, 
        translateService: TranslateService, 
        private selectLanguageService : SelectLanguageService, 
        private auth: AuthService,
        private router: Router, private chc : ChangeDetectorRef) {

        super(translateService);

        this.profileMenuItems = [];
        this.smallMenuItems = [];

    }

    private tProfiloUtente : string = '';
    private tImpostazioni : string = '';
    private tTema: string = '';
    private tLingua: string = '';
    private tCambioPassword: string = '';

    override ngOnInit() {
        super.ngOnInit();
        console.log('Screen resolution Width:' + window.screen.width + ' - Height:' + window.screen.height);
    }

    private createSmallMenuItems(): MenuItem[] {
        return [
            {
                label: this.tProfiloUtente,
                icon: 'pi pi-user',
                items: this.createProfileMenuItems()
            },
            {
                label: this.tImpostazioni,
                icon: 'pi pi-cog',
                items: [
                    {
                        label: this.tTema,
                        icon: this.layoutService.isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun',
                        command: () => {
                            this.toggleDarkMode();
                        }
                    },
                    {
                        label: this.tLingua,
                        icon: 'pi pi-globe',
                        items: this.createLanguageMenuItems()
                    }
                ]
            }
        ];
    }

    private createLanguageMenuItems() : MenuItem[] {
        let result : MenuItem[] = [];
        for (const lang of this.selectLanguageService.languages) {
           result.push({
                label: lang.name,
                icon: lang.icon,
                command: () => {
                    this.selectLanguageService.selectedLanguageChanged(lang);
                }
            });
        }
        return result;
    }

    private createProfileMenuItems(): MenuItem[] {
        return [
            {
                label: this.tCambioPassword,
                icon: 'pi pi-user-edit',
                command: () => {                    
                    this.showChangePwd = false;
                    this.chc.detectChanges();
                    this.showChangePwd = true;
                }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logOut();
                }
            }
        ];
    }

    override applyTranslation() {
        this.tProfiloUtente = this.translate.instant('Profilo Utente')
        this.tImpostazioni = this.translate.instant('Impostazioni')
        this.tTema = this.translate.instant('Tema')
        this.tLingua = this.translate.instant('Lingua')
        this.tCambioPassword = this.translate.instant('Cambio Password')

        this.profileMenuItems = this.createProfileMenuItems();
        this.smallMenuItems = this.createSmallMenuItems();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    public logOut() {
        this.auth.logOut();
        this.router.navigate(['/auth/login']);
    }

    public goToHome() {
        this.router.navigate(['/home']);
    }

    public companiesSelectChanged() {
        this.auth.selectedCompany = this.selectedCompany;
        this.auth.selectedCompanyChanged.emit(this.selectedCompany);
        this.router.navigate(['/home']);
    }
}