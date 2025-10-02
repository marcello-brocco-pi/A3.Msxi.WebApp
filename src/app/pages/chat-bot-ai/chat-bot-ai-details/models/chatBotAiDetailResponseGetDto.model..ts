import { PromptCategoryAndPromptInfoDto } from "./promptCategoryAndPromptInfoDto.model";
import { PromptContextDto } from "./promptContextDto.model";

export interface ChatBotAiDetailResponseGetDto {
    promptContextList : PromptContextDto[];
    promptCategoriesList : PromptCategoryAndPromptInfoDto[];
}
