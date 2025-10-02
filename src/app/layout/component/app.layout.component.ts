import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar.component';
import { AppSidebar } from './app.sidebar.component';
import { AppFooter } from './app.footer.component';
import { ComponentBaseComponent } from '../../shared/componentbase/component-base.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth/auth.service';
import { CompanyInfo } from '../../core/models/company-info.model';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../service/layout.service';
import { VersionInfoResultResponseGetDto } from '../models/version-info-result-response-get-dto.model';
import { ButtonModule } from 'primeng/button';
import { AppToastNewVersion } from "./app.toast-new-version.component";
import { UploadStatusNotifyDto } from '../models/upload-status-notify-dto.model';
import { FeNotifyComponent } from "../../shared/toasters/fe-notify/fe-notify.component";
import { RemoteClientNotifyComponent } from '../../shared/toasters/rem-client-notify/remote-client-notify.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, ToastModule, TranslateModule,
    ButtonModule, AppToastNewVersion, RemoteClientNotifyComponent, FeNotifyComponent],
    providers: [MessageService],
    templateUrl: './app.layout.component.html',
})
export class AppLayout extends ComponentBaseComponent implements OnInit, OnDestroy {
    overlayMenuOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    public version: string = '';
    public versionTimer: any;
    public versionInfoVisible: boolean = false;
    public message: UploadStatusNotifyDto = {userId:0, status: '', fileName: '', idLogGenFileManager: 0, companyId: 0, respMsg: '', isLoadPreview: false};

    private readonly VERSION_POLLING_TIMER_MSEC = 3 * 60 * 1000;
    public isUpdating: boolean = false;

    get selectedCompany(): CompanyInfo | null {
        return this.auth.selectedCompany;
    }

    set selectedCompany(value: CompanyInfo | null) {
        this.auth.selectedCompany = value;
    }

    get loggedInUserInfo() {
        return this.auth.userInfo;
    }

    get loggedInUserInfoRoles(): string {
        return this.auth.getLoggedUserRolesString();
    }

    get companiesForUser(): CompanyInfo[] {
        let companies: CompanyInfo[] = [];
        if (this.auth.userInfo && this.auth.userInfo.companies) {
            companies = this.auth.userInfo.companies;
        }

        return companies;
    }

    get loggedInUserCompany(): string {
        let company = '';
        if (this.auth.userInfo && this.auth.userInfo.companyName) {
            company = this.auth.userInfo.companyName;
        }
        return company;
    }


    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        translate: TranslateService,
        private messageService: MessageService,
        private auth: AuthService) {
        super(translate);

        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    public reloadPageForNewVersion() {
        window.location.reload();
    }

    override applyTranslation(): void {

    }

    override ngOnInit() {
        super.ngOnInit();

        this.translate.setDefaultLang('it');
        this.version = environment.Version;
        this.versionInfoVisible = false;

        this.startVersionTimer();
        this.checkVersion();

    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': (this.layoutService.layoutState().staticMenuDesktopInactive || !this.layoutService.layoutState().sidebarVisible) && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    public isInRole(roles: string): boolean {
        return this.auth.isInRole(roles);
    }

    public logout() {
        this.auth.logOut();
        this.router.navigate(['/auth']);
    }

    // public selectedCompanyChanged() {
    //     this.auth.selectedCompany = this.selectedCompany;
    //     this.router.navigate(['/home']);
    // }

    private startVersionTimer() {
        this.versionTimer = setInterval(() => {
            this.checkVersion();
        }, this.VERSION_POLLING_TIMER_MSEC);
    }

    private checkVersion() {
        try {
            this.layoutService.getProductVersion().subscribe({
                next: (data: VersionInfoResultResponseGetDto) => {
                    if (!this.versionInfoVisible && data && (data.productVersion != environment.Version)) {
                        this.messageService.add({
                            severity: 'info',
                            key: 'newversion',
                            sticky: true,
                            closable: false,
                            icon: 'pi pi-info-circle',

                        });
                        this.versionInfoVisible = true;
                    }
                },
                error: (err) => {
                }
            });
        } catch (error) {
        }
    }



    override ngOnDestroy() {
        super.ngOnDestroy

        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }

        if (this.versionTimer) {
            clearInterval(this.versionTimer); // Distruggi il timer
        }

    }
}
