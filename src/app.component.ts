import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import localeIt from '@angular/common/locales/it';
import localeEnGb from '@angular/common/locales/en-GB';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SignalrService } from './app/shared/services/signalr-service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ConfirmDialog],
    template: `
        <p-confirmdialog [style]="{ width: '50vw' }"/>       
        <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private translate: TranslateService, private router : Router, private signalrService: SignalrService) { 
        const currentUrl = window.location.pathname;
        if (currentUrl !== '/home') {
        this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        const userLanguage = localStorage.getItem('language') || 'it';
        localStorage.setItem('language', userLanguage);
    
        this.translate.setDefaultLang(userLanguage);
        this.translate.use(userLanguage);
    
        registerLocaleData(localeIt, 'it');
        registerLocaleData(localeEnGb, 'en-GB');
        
        this.signalrService.startConnection(); 
        console.log(`Start MAIN`);
    }

     ngOnDestroy() {       
        this.signalrService.closeConnection(); // Chiudi la connessione SignalR
    }

}
