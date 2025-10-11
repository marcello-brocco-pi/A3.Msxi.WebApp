import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { StorageDto } from '../../../shared/models/storage-dto';

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
  @Output() updateChapterContent = new EventEmitter<void>();

  isUpdating: boolean = false;
  newPromptRequestForm: FormGroup | null = null;
  storageChapterContent: string = 'storageChapterContent';



  get bodyField() {
      return this.newPromptRequestForm?.get('body');
  }

  get promptField() {
      return this.newPromptRequestForm?.get('prompt');
  }

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
      let storageData: StorageDto = {id: 0, content: ''};
      storageData = JSON.parse(localStorage.getItem(this.storageChapterContent) || '{}');
      // set the value to the body
      // this.bodyField?.setValue(this.bodyTextSrc);
      this.bodyField?.setValue(storageData.content);
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
      this.bodyField?.setValue(this.bodyTextSrc);
    }
  }
  
  createRequest() {
    const request: PromptRequestDto = {
      kbHubSourceSyncId: this.kbHubSourceSyncId,
      bodyTextSrc: this.bodyField?.value ?? '',
      userPrompt: this.promptField?.value ?? ''
    };
    this.isUpdating = true;
    this.newPromptRequestForm?.disable();
    this.emailProcessService.createPromptRequest(request).subscribe({
      next: (data : PromptResponseDto) => {
        this.isUpdating = false;
        this.newPromptRequestForm?.enable();
        this.bodyField?.setValue(data.lllmResponseContent);
        this.chg.detectChanges();
        let storageData: StorageDto = {id: 0, content: ''};
        storageData = JSON.parse(localStorage.getItem(this.storageChapterContent) || '{}');
        storageData.content = data.lllmResponseContent;
        localStorage.setItem(this.storageChapterContent, JSON.stringify(storageData));
        // emit event to parent to update the chapter content
        this.updateChapterContent.emit();
        this.closeDialog();
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

  isEditorValid(): boolean {
        const value = this.bodyField?.value;
        const check = value !== null && value !== undefined && value !== '' && value !== '<p><br></p>' && value !== '<p></p>';
        return !!check;
  }

  isFormValid(): boolean {
    const check = (this.newPromptRequestForm?.valid && this.isEditorValid());
    console.log('isFormValid:', !!check);
    return !!check;
  }
}

