import { Component, Input } from '@angular/core';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../../user-profile-service.service';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ModalMessageService } from '../../../../shared/modal-message/modal-message.service';
import { ChangePasswordRequestDto, UserManagementResponseDto } from '../../models/change-password-request.dto.model';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, FluidModule, ButtonModule, InputTextModule, CommonModule, DialogModule],
  templateUrl: './change-password.component.html',
  providers: [TranslateService, Router],
})
export class ChangePasswordComponent  extends ComponentBaseComponent {

  public isLoading : boolean | null = false;
  @Input() visible: boolean = false;  
  public changePasswordForm: FormGroup<{
    actualPassword: FormControl<string | null>;
    password: FormControl<string | null>;
    repeatPassword: FormControl<string | null>;
  }>;

  constructor(private userProfileService : UserProfileService, translate : TranslateService,
    private modalMessageService : ModalMessageService,  private router : Router, private authService: AuthService) {
    super(translate);
    this.changePasswordForm = new FormGroup({
        actualPassword: new FormControl('', Validators.required),
        password: new FormControl('', [ Validators.required, Validators.minLength(8)]),
        repeatPassword: new FormControl('', [ Validators.required, Validators.minLength(8)])
      }, { validators: this.newPasswordMustBeEqualsValidator });
  }
  
  protected override applyTranslation(): void {
  } 

  get actualPassword() {
    return this.changePasswordForm.get('actualPassword');
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get repeatPassword() {
    return this.changePasswordForm.get('repeatPassword');
  }

  private newPasswordMustBeEqualsValidator(control: AbstractControl): ValidationErrors | null {
    //determino il primo del mese precedente a quello corrente
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if (password && repeatPassword) {
      return password && repeatPassword && (password.value != repeatPassword.value) ? { newPasswordMustBeEquals: true } : null;
    } else {
      return null;
    }
  }

  public submitChangePassword() {
    if (this.changePasswordForm.valid) {
      const request: ChangePasswordRequestDto = {
        userName: this.authService.userInfo?.username ?? '',
        actualPassword: this.actualPassword?.value as string,
        password: this.password?.value as string,
        repeatPassword: this.repeatPassword?.value as string,
      };

      this.isLoading = true;

      this.userProfileService.changePassword(request).subscribe({
        next: (data: UserManagementResponseDto) => {
          this.isLoading = false;
          if (data.isOk) {
            this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
            this.router.navigate(['/auth/login']);
          } else {
            this.modalMessageService.showError(data.messages);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        }
      });
    }
  }

  onShow() {
    // reset form
    this.changePasswordForm.reset();
  }

  close() {
    this.visible = false;
    this.isLoading = false;
  }

  ok() {
    this.submitChangePassword();
    this.close();
  }

}
