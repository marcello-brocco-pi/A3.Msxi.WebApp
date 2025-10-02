import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../shared/componentbase/component-base.component';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { AuthResponseGetDto } from '../../core/services/auth/models/auth-response-get-dto.model';
import { ModalMessageService } from '../../shared/modal-message/modal-message.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, 
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        MessageModule,
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator, 
        TranslateModule,
        ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
})
export class Login extends ComponentBaseComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup<{ username: FormControl<string | null>; password: FormControl<string | null>; }>;
    public showLogInError: boolean;
    public formSubmitted: boolean;
    public isLoading: boolean;
    public calculatedTheme: string = 'light';
  
    private tErrorMessageUsernameAndPassword : string = '';
    

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }

    get logoImgSrc(): string {
        const currentTheme = this.calculatedTheme;
        return (currentTheme == 'dark') ? 'assets/logo-dark-bg.png' : 'assets/logo.png';
    }
    constructor(private auth: AuthService, private router: Router, translate: TranslateService, private modalMessageService : ModalMessageService) { 
        super(translate);
        
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
        this.showLogInError = false;
        this.formSubmitted = false;
        this.isLoading = false;
    }

    override ngOnInit() {
        super.ngOnInit();
        this.translate.setDefaultLang('it');
    }

    protected override applyTranslation() {
        this.tErrorMessageUsernameAndPassword = this.translate.instant('inserire username e password')
    }

    

    public submitLogin() {
        this.formSubmitted = true;

        if (this.username?.value && this.password?.value) {

            this.loginForm.disable();
            this.isLoading = true;

            this.auth.getLogin(this.username?.value, this.password?.value).subscribe({
                next: (data: AuthResponseGetDto) => {
                    this.auth.userInfo = data.userInfo;
                    this.auth.token = data.token;

                    if (data.userInfo != null) {
                        //this.router.navigate(['/home']);
                        window.location.href = '/home';
                    } else {
                        this.showLogInError = true;
                    }
                    this.loginForm.enable();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
                    this.loginForm.enable();
                    this.isLoading = false;
                }
            });

        } else {
            this.modalMessageService.showError(this.tErrorMessageUsernameAndPassword);
            this.showLogInError = true;
            this.isLoading = false;
        }
    }
}
