import { CategoriaDto, FieldInfoValuesDto } from "./categoriaDto.model";

export interface DocumentUploadDetailResponseGetDto {
    categorie : CategoriaDto[];
    fieldInfoValues: FieldInfoValuesDto[];
}
