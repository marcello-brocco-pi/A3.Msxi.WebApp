import { FieldInfoDto } from "../../generic-file-upload/models/fieldInfoDto.model.ts";

export interface Categoria {
    id : number | null;
    name : string;
    configuration:string | null;
    showSearchRawTextAttach : boolean;
    fields : FieldInfoDto[];    
}