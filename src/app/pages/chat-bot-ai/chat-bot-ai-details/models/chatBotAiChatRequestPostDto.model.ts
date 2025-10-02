import { ChatShortDetailDto } from "./chatShortDetailDto.model";

export interface ChatBotAiChatRequestPostDto {
    userId : number;
    companyId : number;
    promptTextCustom : string | null;
    promptContextId : number | null;
    chatDetail : ChatShortDetailDto;
}
