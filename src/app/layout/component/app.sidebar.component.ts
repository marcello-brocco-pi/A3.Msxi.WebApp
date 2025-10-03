import { Component, ElementRef, Input } from '@angular/core';
import { AppMenu } from './app.menu.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { CompanyInfo } from '../../core/services/auth/models/auth-response-get-dto.model';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    templateUrl: './app.sidebar.component.html',
})
export class AppSidebar {

    @Input() selectedCompany!: CompanyInfo | null;

    constructor(public el: ElementRef, private auth: AuthService) {}

    loggedInUserName() {
        return this.auth.userInfo?.fullName;
    }
}
