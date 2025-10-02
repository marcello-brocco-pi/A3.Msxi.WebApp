export interface FieldInfoDto {
    id : number;
    categoryId : number ;
    label : string;
    description : string;
    type : string;
    order : number | null;
    size : number | null;
    required: boolean;
    idFieldInfoValueGroups : number | null;
    dropdownListValues: string;
    fldDefaultValue:string | null
}
