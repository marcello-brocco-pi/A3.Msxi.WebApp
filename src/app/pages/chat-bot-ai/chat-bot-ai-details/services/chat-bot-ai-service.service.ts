import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../../shared/services/service-base.service';
import { ChatBotAiChatRequestPostDto } from '../models/chatBotAiChatRequestPostDto.model';
import { ChatBotAiChatResponsePostDto } from '../models/chatBotAiChatResponsePostDto.model';
import { ChatBotAiDetailResponseGetDto } from '../models/chatBotAiDetailResponseGetDto.model.';
import { ChatShortDetailDto } from '../models/chatShortDetailDto.model';
import { PromptContextDto } from '../models/promptContextDto.model';

@Injectable({
    providedIn: 'root'
})
export class ChatBotAiService extends ServiceBaseService {


    public selectedPromptContext : PromptContextDto | null = null;
    public selectedContext : PromptContextDto | null = null;

    constructor(private http: HttpClient, translate : TranslateService) {
        super(translate);
    }
    protected override applyTranslation(): void {
        // Implement any translation logic here if needed
    }

    public postChat(companyId: number, userId: number, promptContextId : number | null, promptTextCustom : string | null, chatDetail : ChatShortDetailDto) : Observable<ChatBotAiChatResponsePostDto> {
        const request : ChatBotAiChatRequestPostDto = {
            companyId : companyId,
            userId : userId,
            promptTextCustom : promptTextCustom,
            promptContextId: promptContextId,
            chatDetail : chatDetail
        };

        return this.http.post<ChatBotAiChatResponsePostDto>(this.BASE_URL + '/ChatBotAi/Chat', request)
        .pipe(
            catchError(this.handleError.bind(this))
        );
    }
    
    public getChatBotAiDetailForCompanyAndUser(companyId : number, userId : number, promptContextId : number | null): Observable<ChatBotAiDetailResponseGetDto> {

        let params = new HttpParams()
            .append("companyId", companyId ?? '')
            .append("userId",userId ?? '')
            .append("promptContextId",promptContextId ?? '')
      
        return this.http.get<ChatBotAiDetailResponseGetDto>(this.BASE_URL + '/ChatBotAI/Chat/default', {params : params})
            .pipe(
                catchError(this.handleError.bind(this))
            );
    }

}

