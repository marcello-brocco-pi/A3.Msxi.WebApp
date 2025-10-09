import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileRemoveEvent, FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SourceEmailDto, UploadedAttachmentDto } from '../models/SourceEmailDto';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';
import { EmailProcessService } from '../../services/email-process.service';
import { Output, EventEmitter } from '@angular/core';


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
  @Input() kbHubSourceSyncId: number = 0;
  isUpdating: boolean = false;
  newRequestForm: FormGroup | null = null;
  emailAttachs: UploadedAttachmentDto[];
  // Call a parent method like onExecuteClick using Output event emitter
  @Output() refreshListEvent = new EventEmitter<void>();


  constructor(private modalMessageService : ModalMessageService, translate: TranslateService,
    private authService: AuthService, private generalUtilsService: GeneralUtilsService,
    private emailProcessService: EmailProcessService) {
    super(translate);
    this.applyTranslation();
    this.emailAttachs = [];
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
      subject: new FormControl<string | null>(null, Validators.required),
      body: new FormControl<string | null>(null, Validators.required)
    });
  }

  ngOnChanges() {

  }

  async onSelectedFiles($event: FileSelectEvent) {        
      const filesArray = Array.from($event.files);
      for (const file of filesArray) {
          const newFile: UploadedAttachmentDto = {
              id: 0,
              uploadedPath: '',
              name: file.name,
              contentType: file.type,
              content:  (await this.generalUtilsService.blobToBase64(file) as string).split(',')[1] // rimuove il prefisso data:
          };
          this.emailAttachs.push(newFile);
      }
  }
  
  onRemoveFile($event: FileRemoveEvent) {       
      // remove the file from the files array where file.fileName == $event.file.name
      this.emailAttachs = this.emailAttachs.filter(f => f.name !== $event.file.name);
  }


  createRequest() {
    this.isUpdating = true;
    // Simulate an API call
    const request: SourceEmailDto = {} as SourceEmailDto;
    request.kbHubSourceSyncId = this.kbHubSourceSyncId;
    request.subject = this.newRequestForm?.get('subject')?.value ?? '';
    request.bodyText = this.newRequestForm?.get('body')?.value ?? '';
    request.userIdLastUpdate = this.authService.userInfo?.username ?? 'unknown';
    request.from = this.newRequestForm?.get('email')?.value ?? this.authService.userInfo?.email ?? 'unknown';
    request.emailAttachs = this.emailAttachs;
    // I need to Post a new email request to the API that return an integer (the new email id created)
    this.emailProcessService.createNewEmailRequest(request).subscribe({
      next: (data: number) => {
        console.log('New email request created with ID:', data);
        this.isUpdating = false;  
        this.refreshListEvent.emit();
        this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
        this.closeDialog();
      },
      error: (err: string) => {
        this.isUpdating = false;  
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
      }
    });

  }

  closeDialog() {
    this.visible = false;
  }
}
