import { FormControl } from "@angular/forms";
import { FieldInfoDto } from "./fieldInfoDto.model.ts";
import { OutputPropsInfoDto } from "./outputPropsInfoDto.model.js";


export interface DynamicFormControlInfo {
    key : string;
    control : FormControl;
    fieldInfo : FieldInfoDto | null;
    outputPropsInfoDto : OutputPropsInfoDto | null;
}

export interface FldRageFromTo extends DynamicFormControlInfo{
  keyTo : string;
}
