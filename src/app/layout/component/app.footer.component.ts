import { Component, Input, input } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooter {
    isShowUser: boolean = false;
    @Input({ required: true}) version: string = '';
    private _containerClass: any;
    @Input()
    set containerClass(value: any) {
        if (this._containerClass !== value) {
            this._containerClass = value;
            // Handle the change here
            this.isShowUser = value['layout-static-inactive'] !== undefined && value['layout-static-inactive'] === true;
          // console.log('Container class changed:', this._containerClass);
        }
    }

    get containerClass(): any {

        return this._containerClass;
    }

    constructor(private auth: AuthService) {}

    loggedInUserName() {
        return this.auth.userInfo?.fullName;
    }
}
