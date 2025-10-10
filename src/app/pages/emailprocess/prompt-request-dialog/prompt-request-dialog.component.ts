import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { Editor, EditorInitEvent, EditorModule } from 'primeng/editor';
import { EmailProcessService } from '../../services/email-process.service';
import { PromptRequestDto, PromptResponseDto } from '../models/prompt-request-dto';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { DotsLoaderComponent } from "../../../shared/dots-loader/dots-loader.component";

@Component({
  selector: 'app-prompt-request-dialog',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    ReactiveFormsModule,
    Editor,
    DotsLoaderComponent
],
  templateUrl: './prompt-request-dialog.component.html'
})
export class PromptRequestDialogComponent extends ComponentBaseComponent implements OnInit{
    @Input() visible: boolean = false;
    @Input() kbHubSourceSyncId: number = 0;
    @Input() bodyTextSrc: string = '';
    isUpdating: boolean = false;
    newPromptRequestForm: FormGroup | null = null;
    storageChapterContent: string = 'storageChapterContent';

  constructor(translate: TranslateService, private chg: ChangeDetectorRef, private emailProcessService: EmailProcessService,
    private modalMessageService: ModalMessageService
  ) {
    super(translate);
    this.applyTranslation();
  }

  protected override applyTranslation(): void {
  
  }

  async onInitEditor(event: any) {
    setTimeout(() => {
      // read the local storage
  
      // const editorInstance = event.editor as Quill;
      // editorInstance.clipboard.dangerouslyPasteHTML("<p>Testo di esempio</p>");  
    }, 1000);
    
  } 

  
  onShow() {
      this.bodyTextSrc = localStorage.getItem(this.storageChapterContent) || '';
      // set the value to the body
      this.newPromptRequestForm?.get('body')?.setValue(this.bodyTextSrc);
      this.chg.detectChanges();
  }

  override ngOnInit(): void {
    // Initialization logic here
    super.ngOnInit();
    this.setupForm();
  }

  setupForm() {
      this.newPromptRequestForm = new FormGroup({
        body: new FormControl<string | null>(this.bodyTextSrc, Validators.required),
        prompt: new FormControl<string | null>(null, Validators.required)
      });
  }

  ngOnChanges() {
    if (this.newPromptRequestForm && this.bodyTextSrc) {
      this.newPromptRequestForm.get('body')?.setValue(this.bodyTextSrc);
    }
  }
    
  createRequest() {
    const request: PromptRequestDto = {
      kbHubSourceSyncId: this.kbHubSourceSyncId,
      bodyTextSrc: this.newPromptRequestForm?.get('body')?.value ?? '',
      userPrompt: this.newPromptRequestForm?.get('prompt')?.value ?? ''
    };
    this.isUpdating = true;
    this.newPromptRequestForm?.disable();
    this.emailProcessService.createPromptRequest(request).subscribe({
      next: (data : PromptResponseDto) => {
        this.isUpdating = false;
        this.newPromptRequestForm?.enable();
        alert('Risposta da AI: ' + data.lllmResponseContent);
        this.newPromptRequestForm!.get('body')?.setValue(data.lllmResponseContent);
        this.chg.detectChanges();
      },
      error: (err) => {
        this.isUpdating = false;
        this.newPromptRequestForm?.enable();
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
      }
    });

  }

  closeDialog() {
    this.visible = false;
    this.isUpdating = false;
    this.newPromptRequestForm?.enable();
    this.newPromptRequestForm?.reset();
    this.chg.detectChanges();
  }
}
