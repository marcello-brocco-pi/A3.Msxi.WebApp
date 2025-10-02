import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentBaseComponent } from '../../../../shared/componentbase/component-base.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ModalMessageService } from '../../../../shared/modal-message/modal-message.service';
import { ChatBotAiChatResponsePostDto } from '../models/chatBotAiChatResponsePostDto.model';
import { ChatBotAiDetailResponseGetDto } from '../models/chatBotAiDetailResponseGetDto.model.';
import { ChatDetailDto } from '../models/chatDetailDto.model';
import { ChatShortDetailDto } from '../models/chatShortDetailDto.model';
import { PromptCategoryAndPromptInfoDto } from '../models/promptCategoryAndPromptInfoDto.model';
import { PromptContextDto } from '../models/promptContextDto.model';
import { ChatBotAiService } from '../services/chat-bot-ai-service.service';
import { FormatTextUtils } from '../../../../core/services/formatting/format-utils.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DotsLoaderComponent } from "../../../../shared/dots-loader/dots-loader.component";
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'app-chat-bot-ai-details',
    standalone: true,
     styleUrl: './chat-bot-ai-details.component.css',
    imports: [CommonModule, TranslateModule, SelectModule, FormsModule, FluidModule, TabsModule, ToggleSwitch, DotsLoaderComponent, AccordionModule],
    templateUrl: './chat-bot-ai-details.component.html',
})
export class ChatBotAiDetails extends ComponentBaseComponent implements OnInit, OnDestroy{
  public isLoadingDetail: boolean = false;
  public promptCategoriesAndPromptInfoList: PromptCategoryAndPromptInfoDto[] = [];
  public promptCategoriesMap: { [key: string]: PromptCategoryAndPromptInfoDto[] } = {};
  public promptCategoriesKeys: string[] = [];
  public isConversationStarted: boolean = false;
  public conversationDetail: ChatDetailDto | null = null;
  public promptUserText: string | null = null;
  public contextList: PromptContextDto[] = [];
  public isDiagInfoAccordionVisible = false;
  public isAllCategoriesCollapsed = true
  public allCategoriesActiveTabIndex: number | null = null;

  @ViewChild('chatInputTextBox') chatInputTextBox: ElementRef | undefined;
  @ViewChild('chatMessagesContainerDiv') chatMessagesContainerDiv: ElementRef | undefined;
  private tAziendaOutenteNonRecuperati: string = '';
  private tUtenteNonRecuperato: string = '';
  private tAziendaNonRecuperata: string = '';
  private tContestoNonRecuperato: string = '';
  private tNuovaChat: string = '';
  public  idSelectedContext: any;

  constructor(private auth: AuthService, private modalMessageService: ModalMessageService, 
    private chatbotAiService: ChatBotAiService, private formatTextUtilsService : FormatTextUtils, translate : TranslateService) {
    super(translate);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setInitialState();
    this.loadData();
  }
  override applyTranslation() {
    this.tAziendaOutenteNonRecuperati = this.translate.instant("Azienda o utente non recuperati");
    this.tUtenteNonRecuperato = this.translate.instant("Utente non recuperato");
    this.tAziendaNonRecuperata = this.translate.instant("Azienda non recuperata");
    this.tContestoNonRecuperato = this.translate.instant("Contesto non recuperato");
    this.tNuovaChat = this.translate.instant("Nuova chat");
  }

  public getHTMLFromJSONObj(obj: any) {
    return this.formatTextUtilsService.getHTMLFromJSONObj(obj);
  }

  public getJSONObjFromStr(source: string): any {
    console.log('src', source);
    let jsonRes = this.formatTextUtilsService.getJSONObjFromStr(source);
    console.log('jsonRes', this.formatTextUtilsService.getJSONObjFromStr(source));
    return this.formatTextUtilsService.getJSONObjFromStr(jsonRes.attempts);
  }

  public replaceTextLFToBR(source: string): string {
    return this.formatTextUtilsService.replaceTextLFToBR(source);
  }

  public isInRole(roles: string): boolean {
    return this.auth.isInRole(roles);
  }

  public startNewConversation() {
    this.ngOnInit();
  }
  
  public openOffCanvasPanel(content: TemplateRef<any>) {
    alert('Open offcanvas panel is not implemented yet.');
   // this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title', position: 'end' });
  }

  public get selectedContext(): PromptContextDto | null {
    return this.chatbotAiService.selectedContext;
  }

  public contextSelected() {
    // idSelectedContextList is used to store the id of the selected context from the dropdown
    this.chatbotAiService.selectedContext = this.contextList.find(x => x.id == this.idSelectedContext.id) ?? null;
    this.setInitialState();
    this.loadData();
  }

  public sendCoversationHistoryAndNewUserPrompt(userPrompt: string | null) {
    let selectedCompany: number | null;
    let userId: number;

    const selectedPromptContextId = this.chatbotAiService.selectedContext?.id ?? null;

    this.checkForSelectedPromptContextIdNotNul(selectedPromptContextId);
    userId = this.getUserIdFromAuthOrThrowError();
    selectedCompany = this.getSelectedCompanyOrThrowError();

    if (selectedCompany && userId) {
      this.isConversationStarted = true;
      this.isLoadingDetail = true;
      let chatShortDetail: ChatShortDetailDto;
      const isEmptyConversation = this.conversationDetail == null;
      
      if (isEmptyConversation) {
        this.createConversationDetailForFirstMsg(userPrompt);
        chatShortDetail = this.getChatShortDetailDtoForFirstRequest(userPrompt ?? '');
      } else {
        this.addMsgToConversationDetail(userPrompt);
        chatShortDetail = this.mapChatDetailDtoToChatShortDetailDto(this.conversationDetail!);
      }

      this.updChatMsgScrollAndInputUI(true,false);

      this.chatbotAiService.postChat(selectedCompany, userId, selectedPromptContextId, userPrompt, chatShortDetail)
        .subscribe({
          next: (data: ChatBotAiChatResponsePostDto) => {

            if (this.conversationDetail == null) {
              this.conversationDetail = data.chatDetail;
            } else {
              if (this.conversationDetail.messages == null) {
                this.conversationDetail.messages = [];
              }
              for (const receivedMessage of data.chatDetail.messages) {
                let existingMessage = this.conversationDetail.messages.find(x => x.id == receivedMessage.id);
                if (existingMessage == null) {
                  this.conversationDetail.messages.push(receivedMessage);
                } else {
                  Object.assign(existingMessage, receivedMessage);
                }
              }
            }
            this.isLoadingDetail = false;
            this.promptUserText = '';
            this.updChatMsgScrollAndInputUI(true, true);
          },
          error: (err) => {
            this.isLoadingDetail = false;
            this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
            this.updChatMsgScrollAndInputUI(true, true);
          }
        });

    } else {
      throw new Error(this.tAziendaOutenteNonRecuperati);
    }
  }

  private addMsgToConversationDetail(userPrompt: string | null) {
    let newMessage = {
      id: this.conversationDetail!.messages.length,
      timestampRequest: new Date(),
      timestampResponse: null,
      userPrompt: userPrompt ?? '',
      response: '',
      isResponseStatusOk: true,
      intermediate_Steps: '',
      errorResponse: '',
      isWaitingForResponse: true
    };
    this.conversationDetail!.messages.push(newMessage);
    newMessage.id = this.conversationDetail!.messages.length - 1;
  }

  private createConversationDetailForFirstMsg(userPrompt: string | null) {
    this.conversationDetail = {
      id: 0,
      title: '',
      messages: []
    };
    this.conversationDetail.messages.push({
      id: 0,
      timestampRequest: new Date(),
      timestampResponse: null,
      userPrompt: userPrompt ?? '',
      response: '',
      isResponseStatusOk: true,
      intermediate_Steps: '',
      errorResponse: '',
      isWaitingForResponse: true
    });
  }

  private updChatMsgScrollAndInputUI(scrollDown : boolean, setFocusOnTextInput : boolean) {
    setTimeout(() => {
      if (scrollDown) {
        if (this.chatMessagesContainerDiv?.nativeElement) {
          this.chatMessagesContainerDiv.nativeElement.scrollTop = this.chatMessagesContainerDiv.nativeElement.scrollHeight;
        }
      }
      if (setFocusOnTextInput) {
        this.chatInputTextBox?.nativeElement.focus();  
      }
    }, 0);
  }

  private getUserIdFromAuthOrThrowError() : number {
    if (!(this.auth.userInfo?.id)) {
      throw new Error(this.tUtenteNonRecuperato);
    }

    return this.auth.userInfo.id;
  }

  private getSelectedCompanyOrThrowError() {
    let selectedCompany: number | null
    if (this.auth.selectedCompany) {
      //utente più aziende
      selectedCompany = this.auth.selectedCompany.id;
    } else if (this.auth?.userInfo?.companies && this.auth?.userInfo?.companies.length > 0) {
      selectedCompany = this.auth.userInfo.companies[0].id;
    } else {
      throw new Error(this.tAziendaNonRecuperata);
    }
    
    return selectedCompany;
  }

  private checkForSelectedPromptContextIdNotNul(selectedPromptContextId: number | null) {
    if (selectedPromptContextId == null) {
      throw new Error(this.tContestoNonRecuperato);
    }
  }

  private setInitialState() {
    this.isConversationStarted = false;
    this.isLoadingDetail = false;
    this.conversationDetail = null;
    this.promptUserText = null;
    this.clearPromptCategoriesAndHideUI();
  }

  private clearPromptCategoriesAndHideUI() {
    this.promptCategoriesAndPromptInfoList = [];
    this.promptCategoriesKeys = [];
    this.promptCategoriesMap = {};
    this.isAllCategoriesCollapsed = true;
    this.allCategoriesActiveTabIndex = null;
  }

  private loadData() {
    this.isLoadingDetail = true;

    let selectedCompany: number | null;
    let userId: number;

    userId = this.getUserIdFromAuthOrThrowError();
    selectedCompany = this.getSelectedCompanyOrThrowError();

    if (selectedCompany && userId) {
      this.chatbotAiService.getChatBotAiDetailForCompanyAndUser(selectedCompany, userId, this.selectedContext?.id ?? null)
        .subscribe({
          next: (data: ChatBotAiDetailResponseGetDto) => {
            this.contextList = data.promptContextList;
            this.promptCategoriesAndPromptInfoList = data.promptCategoriesList;
            this.mapPromptCategoriesListToPromptCategoriesMapAndKeys(this.promptCategoriesAndPromptInfoList, this.promptCategoriesMap, this.promptCategoriesKeys);
            this.isLoadingDetail = false;
          },
          error: (err) => {
            this.isLoadingDetail = false;
            this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
          }
        })
    }
  }

  private mapPromptCategoriesListToPromptCategoriesMapAndKeys(
    promptCategoriesAndPromptInfoList : PromptCategoryAndPromptInfoDto[], 
    promptCategoriesMap: { [key: string]: PromptCategoryAndPromptInfoDto[] },
    promptCategoriesKeys : string[]) {
      
    for (const c of promptCategoriesAndPromptInfoList) {
      let existingCategoryInMap = promptCategoriesMap[c.categoryName];
      if (!existingCategoryInMap) {
        promptCategoriesKeys.push(c.categoryName);
        existingCategoryInMap = [];
        promptCategoriesMap[c.categoryName] = existingCategoryInMap;
      }
      let existingPrompt = existingCategoryInMap.find(x => x.promptTitle == c.promptTitle);
      if (!existingPrompt) {
        existingPrompt = c;
        existingCategoryInMap.push(existingPrompt);
      }
    }
  }

  private mapChatDetailDtoToChatShortDetailDto(chatDetail: ChatDetailDto): ChatShortDetailDto {
    let res: ChatShortDetailDto = {
      id: chatDetail.id,
      title: chatDetail.title,
      messages: chatDetail.messages.map(m => {
        return {
          id: m.id,
          userPrompt: m.userPrompt,
          response: m.response
        }
      })
    }

    return res;
  }

  private getChatShortDetailDtoForFirstRequest(promptText: string): ChatShortDetailDto {
    return {
      messages: [
        {
          id: 0,
          userPrompt: promptText,
          response: '',
        }],
      id: 0,
      title: this.tNuovaChat
    }
  }

}
