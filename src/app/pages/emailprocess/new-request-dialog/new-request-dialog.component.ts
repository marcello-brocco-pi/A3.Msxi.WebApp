import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { AuthService } from '../../../core/services/auth/auth.service';


@Component({
  selector: 'app-new-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-request-dialog.component.html'
})

export class NewRequestDialogComponent extends ComponentBaseComponent implements OnInit{
  @Input() visible: boolean = false;
  isUpdating: boolean = false;
  newRequestForm: FormGroup | null = null;

  constructor(private modalMessageService : ModalMessageService, translate: TranslateService, private authService: AuthService) {
    super(translate);
  }

  protected override applyTranslation(): void {
  
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setupForm()
    setTimeout(() => {
      const input = document.getElementById('subject') as HTMLInputElement;
      if (input) {
        console.log('Focusing input');
        input.select();
      }
    }, 10);
  }
  setupForm() {
    this.newRequestForm = new FormGroup({
      email: new FormControl<string | null>(this.authService.userInfo?.email || ''),
      subject: new FormControl<string | null>(null),
      body: new FormControl<string | null>(null)
    });
  }

  ngOnChanges() {

  }

  createRequest() {
    this.isUpdating = true;
    // Simulate an API call
    setTimeout(() => {
      this.isUpdating = false;
      this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
      this.closeDialog();
    }, 2000);
  } 

  closeDialog() {
    this.visible = false;
  }
}
