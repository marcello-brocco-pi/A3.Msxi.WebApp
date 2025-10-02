export interface JsonPreviewPostDto {
  updateAnalysisResponse: string;
  requestId: string;
  jsonPreviewStatus: number;
  jsonPreviewType: string;
  fileContentB64: string | null;
}
