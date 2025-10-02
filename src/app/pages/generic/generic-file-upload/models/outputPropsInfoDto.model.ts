export interface OutputPropsInfoDto {
    id : number;
    categoryId : number;
    propName : string;
    label : string;
    description : string | null;
    order : number | null;
    defaultValue : boolean;
}
