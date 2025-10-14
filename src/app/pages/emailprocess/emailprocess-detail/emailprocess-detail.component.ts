import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { TranslateService } from '@ngx-translate/core';
import { EmailProcessService } from '../../services/email-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { EProcessStatus, ParagraphsDto, PatchEmailRequestDto, PatchParagrahRequestDto, SourceEmailDto } from '../models/source-email-dto';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { CardModule } from 'primeng/card';
import { Editor } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PromptRequestDialogComponent } from "../prompt-request-dialog/prompt-request-dialog.component";
import { StorageDto } from '../../../shared/models/storage-dto';
import { ScrollTop } from 'primeng/scrolltop';
@Component({
  selector: 'app-emailprocess-detail',
  imports: [CommonModule, FormsModule, AccordionModule, TranslateModule, ToolbarModule, ButtonModule, 
    Tooltip, CardModule, Editor, PromptRequestDialogComponent, ScrollTop],
  templateUrl: './emailprocess-detail.component.html'
})

export class EmailprocessDetailComponent  extends ComponentBaseComponent implements OnInit  {
  emailId: string;
  kbHubSourceSyncId: string;
  isLoading: boolean = false;
  emailDetails: SourceEmailDto | null = null;
  paragraphs: ParagraphsDto[] = [];
  showPromptDialog: boolean = false ;
  bodyTextInEditor: string = '';
  storageChapterContent: string = 'storageChapterContent';

  constructor(private emailProcessService: EmailProcessService, translate : TranslateService,
            private route: ActivatedRoute, private router: Router, private authService : AuthService,
            private modalMessageService : ModalMessageService, private chg : ChangeDetectorRef) {
    super(translate);
    this.applyTranslation();
    this.emailId = '';
    this.kbHubSourceSyncId = '';
  }
  protected override applyTranslation(): void {
  }

  override ngOnInit(): void {
    this.emailId = this.route.snapshot.paramMap.get('id') ?? '-1';

    this.route.queryParams.subscribe(queryParams => {
      const kbHubSourceSyncId = queryParams['kbHubSourceSyncId'];
      if (kbHubSourceSyncId) {
        this.kbHubSourceSyncId = kbHubSourceSyncId;
      }
    });

    if (this.emailId) {
      this.loadEmailDetails(this.emailId);
    }
  }

  loadEmailDetails(emailId: string) {
    this.emailProcessService.getById(+emailId).subscribe({
      next: (data) => {
        // Handle the email details data
        this.emailDetails = data;
        this.paragraphs = data.paragraphs;
        console.log(data);
      },
      error: (error) => {
        // Handle error
        this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/statusprocesslist']);
  }

  editChapter(id: number) {
    this.isLoading = false;
    // When I edit one paragraph, all the others must exit from edit mode
    this.paragraphs.forEach(p => p.isInEditMode = false);
    // Clear the local storage
    localStorage.removeItem(this.storageChapterContent);
    const chapter = this.paragraphs.find(p => p.id === id);
    if (chapter) {
      this.setChapter(chapter );
      chapter.isInEditMode = true;
      this.focusEditor(id);
      this.bodyTextInEditor = chapter.content;
      this.chg.detectChanges();
    }   
  }

  setChapter(chapter: ParagraphsDto) {
    const storageData: StorageDto = {
      id: chapter.id,
      content: chapter.content
    };
    // Save it in the localstorage in case of accidental refresh
    localStorage.setItem(this.storageChapterContent, JSON.stringify(storageData));
  }

  saveChapter(id: number) {
    const chapter = this.paragraphs.find(p => p.id === id);
    if (chapter) {
      this.isLoading = true;
      let request : PatchParagrahRequestDto = { 
        content: chapter.content,
        userIdLastUpdate: this.authService.userInfo?.username ?? 'unknown',
      };
      this.emailProcessService.patchParagraph(chapter.id, request).subscribe({
        next: () => {
          this.isLoading = false;
          chapter.isInEditMode = false;
          this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
          this.bodyTextInEditor = '';
        },
        error: (error: string) => {
          // Handle error
          this.isLoading = false;
          chapter.isInEditMode = false;
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + error);
          this.ngOnInit();
          this.bodyTextInEditor = '';
        }
      });
    }
  }

  focusEditor(id: number) {
    const chapter = this.paragraphs.find(p => p.id === id);
    if (chapter) {
        chapter.isInEditMode = true;
        setTimeout(() => {
        const editorElement = document.getElementById('idChapter_' + id);
        if (editorElement) {
          editorElement.focus();
        }
      }, 100); 
    }  
  }
 
  finalize() {
     let request: PatchEmailRequestDto = {
          userIdLastUpdate: this.authService.userInfo?.username ?? 'unknown',
          status: EProcessStatus.Finalizing
        };
        this.modalMessageService.showConfirm(this.translate.instant("Confermando l'operazione non sarà più possibile modificare i paragrafi. Prosegui?"), true, true)
          .subscribe((result: "accept" | "reject" | "cancel") => {
            if (result === "accept") {
                this.isLoading = true;
                this.emailProcessService.patchEmail(+this.emailId, request).subscribe({
                  next: () => {
                    this.modalMessageService.showSuccess(this.modalMessageService.defaultOkMessage());
                    this.isLoading = false;
                    this.goBack();
                  },
                  error: (err: any) => {
                    this.isLoading = false;
                    this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
                  }
              });
            }
            else if (result === "reject") {
              
            }      
          });        
  } 

  openDialogPrompt(id: number) {
    const chapter = this.paragraphs.find(p => p.id === id);
    if (chapter) {
      this.setChapter(chapter);
    }
    this.showPromptDialog = false;
    this.chg.detectChanges();
    this.showPromptDialog = true;
    this.chg.detectChanges();
  }


  onUpdateChapterContent() {
    let storageData: StorageDto = {id: 0, content: ''};
    storageData = JSON.parse(localStorage.getItem(this.storageChapterContent) || '{}');
    const chapter =  this.paragraphs.find(p => p.id === storageData.id);
    if (chapter) {
      chapter.content = storageData.content;
      this.bodyTextInEditor = storageData.content;
      this.chg.detectChanges();
    }
  }

  // onClickDelete(id: number) {    
  //   this.modalMessageService.showConfirm(this.translate.instant("Confermi l'operazione?"), true, true)
  //   .subscribe((result: "accept" | "reject" | "cancel") => {
  //     if (result === "accept") {
  //         let request: PatchEmailRequestDto = {
  //           userIdLastUpdate: this.authService.userInfo?.username ?? '',
  //           dateLastUpdate: new Date().toISOString(),
  //           status: EProcessStatus.Finalized
  //         };
  //         this.emailProcessService.patchEmail(+this.emailId, request).subscribe({
  //           next: () => {
  //             this.emailResults = this.emailResults.filter(e => e.id !== id);
  //           },
  //           error: (err: string) => {
  //             this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
  //           }
  //       });
  //     }
  //     else if (result === "reject") {
        
  //     }      
  //   }); 
// }
}
