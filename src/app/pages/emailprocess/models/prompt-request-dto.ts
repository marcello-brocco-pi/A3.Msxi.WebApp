export interface PromptRequestDto {
    kbHubSourceSyncId: number;
    bodyTextSrc: string;
    userPrompt: string;
}

export interface PromptResponseDto {
  // Define the expected properties of the response here
  // For example:
  isSuccess: boolean;
  errorMessages: string[];
  lllmResponseContent: string;
  // result: string;
  // success: boolean;
}