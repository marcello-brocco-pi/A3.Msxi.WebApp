import { DynamicFieldInfoValueDto } from "../../../../core/models/dynamic-fieid-info-value-dto.model.js";
import { OutputPropValueDto } from "./outputPropValueDto.model.js";

export interface GenericFileUploadDetailRequestPostDto {
    categoria: number,
    promptHint : string,
    dynamicFields : DynamicFieldInfoValueDto[]
    outputProps : OutputPropValueDto[],
    tag : string,
    pagesFilter : string,
    filesDto?: FilesUploadDto[]     
}

export interface FilesUploadDto {
  idx:number;
  isMerge: boolean;
  pagesFilter: string;
  contentFiles: ContentFilesDto[];
}

export interface ContentFilesDto {
    fileName: string;
    fileContent: string;
    contentType: string;
}