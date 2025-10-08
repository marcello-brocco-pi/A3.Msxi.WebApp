import { Component, OnInit } from '@angular/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { TranslateService } from '@ngx-translate/core';
import { EmailProcessService } from '../../services/email-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { ParagraphsDto, PatchParagrahRequestDto, SourceEmailResponseGetDto } from '../models/SourceEmailResponseGetDto';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { CardModule } from 'primeng/card';
import { Editor, EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emailprocess-detail',
  imports: [CommonModule, FormsModule, AccordionModule, TranslateModule, ToolbarModule, ButtonModule, Tooltip, CardModule, Editor],
  templateUrl: './emailprocess-detail.component.html'
})

export class EmailprocessDetailComponent  extends ComponentBaseComponent implements OnInit  {
  isLoading: boolean = false;
  emailDetails: SourceEmailResponseGetDto | null = null;
  paragraphs: ParagraphsDto[] = [];
  constructor( private emailProcessService: EmailProcessService, translate : TranslateService,
            private route: ActivatedRoute, private router: Router, 
            private modalMessageService : ModalMessageService) {
    super(translate);
    this.applyTranslation();
  }
  protected override applyTranslation(): void {
  }

  override ngOnInit(): void {
    const emailId = this.route.snapshot.paramMap.get('id');
    if (emailId) {
      this.loadEmailDetails(emailId);
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

  editChapter(rowIdx: number) {
    this.isLoading = false;
    const chapter = this.paragraphs[rowIdx - 1];
    if (chapter) {
      chapter.isInEditMode = true;
      this.focusEditor(rowIdx);
    }
  }

  saveChapter(rowIndex: number) {
    const chapter = this.paragraphs[rowIndex - 1];
    if (chapter) {
      chapter.isInEditMode = false;
      this.isLoading = true;
      let content : PatchParagrahRequestDto = { content: chapter.content };
      this.emailProcessService.patchParagraph(chapter.id, content).subscribe({
        next: () => {
          this.isLoading = false;
          // Handle success if needed
        },
        error: (error: string) => {
          // Handle error
          this.isLoading = false;
          this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + error);
          this.ngOnInit();
        }
      });
    }
  }

  focusEditor(rowIndex: number) {
    const chapter = this.paragraphs[rowIndex - 1];
    if (chapter) {
        chapter.isInEditMode = true;
        setTimeout(() => {
        const editorElement = document.getElementById('idChapter_' + rowIndex);
        if (editorElement) {
          editorElement.focus();
        }
      }, 100); 
    }  
  }
}
