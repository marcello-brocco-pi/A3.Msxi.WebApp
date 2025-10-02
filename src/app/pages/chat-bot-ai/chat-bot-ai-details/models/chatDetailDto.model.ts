import { ChatMessageDto } from "./chatMessageDto.model";

export interface ChatDetailDto {
    id : number;
    title : string;
    messages : ChatMessageDto[];
}
