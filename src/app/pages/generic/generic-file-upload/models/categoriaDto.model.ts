import { FieldInfoDto } from "./fieldInfoDto.model.ts";
import { OutputPropsInfoDto } from "./outputPropsInfoDto.model.js";

export interface CategoriaDto {
    id : number | null;
    name : string;
    showOutputPropsPrompts: boolean;
    configuration:string
    fields : FieldInfoDto[];
    outputPropsInfoDto : OutputPropsInfoDto[];
}

export interface FieldInfoValuesDto {
  id: number;
  idFieldInfoValueGroups: number;
  code: string;
  description: string;
}
export interface CatConfigurationDto {
  customFilterFields:KeyValuesDto[] | null;
  storicoExportReports:StoricoExportReports | null;
}

export interface KeyValuesDto {
  key:   string | null;
  value: string;
}

export interface StoricoExportReports {
  url:   string;
  isXlsx: boolean | null;
  isPdf:  boolean | null;
}