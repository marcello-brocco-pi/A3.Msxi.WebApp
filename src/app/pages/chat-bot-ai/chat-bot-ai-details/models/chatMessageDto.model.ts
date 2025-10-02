export interface ChatMessageDto {
    id : number;
    timestampRequest : Date;
    timestampResponse : Date | null;
    userPrompt : string;
    response : string;
    isResponseStatusOk : boolean;
    intermediate_Steps : string;
    errorResponse : string;
    isWaitingForResponse : boolean;
}
