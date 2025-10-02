import { EsitoDto } from "./EsitoDto.model";

import { OperatoreDto } from "./OperatoreDto.model";
import { ImportStatusFilterDto } from "./ImportStatusFilterDto.model";
import { Categoria } from "./Categorie.model";
import { FieldInfoValuesDto } from "../../generic-file-upload/models/categoriaDto.model";

export interface ImportStatusFilterResponseGetDto {
    item : ImportStatusFilterDto;
    operatori : OperatoreDto[];
    esiti : EsitoDto[];
    categorie : Categoria[];
    fieldInfoValues: FieldInfoValuesDto[];
    operatoriFilterEnabled : boolean;
}
