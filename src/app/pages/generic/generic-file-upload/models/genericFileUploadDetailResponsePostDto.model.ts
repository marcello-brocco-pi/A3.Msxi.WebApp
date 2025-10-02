import { JsonFinderPagedValuesPreviewDto, JsonFinderValuesPreviewDto } from "../../generic-json-preview/models/JsonFinderValuesPreviewDto.model";
import { FileUploadResultInfoItem as GenericFileUploadResultInfoItem } from "./fileUploadResultInfoItem.model";


export interface GenericFileUploadDetailResponsePostDto {
    pagedMappedJsonFinderFields: JsonFinderPagedValuesPreviewDto | null;
    items : GenericFileUploadResultInfoItem[];
    mappedJsonFinderFields : JsonFinderValuesPreviewDto | null;
    remappedClassifierPages : RemappedClassifierPagesByCategoryDto[] | null;
    analysisResponse : string;
    isJsonPreview : boolean | null;
    jsonPreviewType : string | null;
    requestId : string | null;
    fileContentB64 : string | null;
    uploadedFileName : string | null;
    lstAttachmentDto : LogGenFileManagerAttachmentDto[] | null;
    contentResult : ContentResultDto | null;
    status : string;
}

export interface LogGenFileManagerAttachmentDto {
  id: number;
  idLogGenFileManager: number;
  fileName: string;
  filePath: string;
  content: string | null;
  contentType: string;
  direction: string;
  timeStamp: string;
}

export interface JsonPreviewResponseDto {
  mappedJsonFinderFields : JsonFinderValuesPreviewDto | null;
  pagedMappedJsonFinderFields : JsonFinderPagedValuesPreviewDto | null;
  remappedClassifierPages : RemappedClassifierPagesByCategoryDto[] | null;
  requestId : string | null;  
  jsonPreviewType : string | null;
  fileContentB64 : string | null;
  uploadedFileName : string | null;
}

export interface UpdateAttachmentRequestDto {
  fileName: string;
  pages: number[];
  isOverwrite: boolean;
  fileContent: string | null;
}

export interface RemappedClassifierPagesByCategoryDto {
  catIndex:number;
  categoria: string;
  pageItems: PageItemDto[];
}

export interface PageItemDto {
  isMoved: boolean;
  source: string;
  page: number;
}

export interface UpdateAttachmentResponseDto {
  fileName: string;
  fileContentB64: string | null;
  contentType: string;
}

export interface ContentResultDto {
  fileName: string;
  contentType: string;
  content: string;
  contentB64: string|null;
  isReplacePreview: boolean;
  isOpenPrinter: boolean;
}

export interface LogOperationDto {
  logType: number;
  id: number;
  fileName: string;
  filePath: string;
  timeStamp: string;
}

export interface LogTypeDto {
  rowId: string;
  logType: LogTypes;
  id: number;
  fileName: string;
  filePath: string;
  direction: string;
}

export enum LogTypes {
  Operazioni = 1,
  Base64 = 2,
  S3 = 3
}

export enum EDonwloadFormat {
  Bytes = 1,
  Base64 = 2
}

export interface PreviewStateDto {
  isClosed: boolean;
  canPreview: boolean;
  lastUpdateUser: string;
  lastUpdateTs: string;
}

export interface PreviewStatusRequestDto {
  status: number;
}