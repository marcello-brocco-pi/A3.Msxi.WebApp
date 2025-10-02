import { ChatMessageShortDetailDto } from "./chatMessageShortDetailDto.model";

export interface ChatShortDetailDto {
    id : number;
    title : string;
    messages : ChatMessageShortDetailDto[];
}
