import { DynamicFilterFieldInfoValueDto } from "../../../../core/models/dynamic-fieid-info-value-dto.model";
import { DataTableInfo } from "../../shared/models/DataTableModels/data-table-info";

export interface ImportStatusRequestGetDto {
    companyId : number | null;
    operatore : number | null;
    dataInsDa : Date | string | null;
    dataInsA : Date | string | null;
    esito : number | null;
    categoria : number | null;
    nomeAllegato : string | null;
    dataTableInfo : DataTableInfo | null;
    dynFilterFields: DynamicFilterFieldInfoValueDto[];
    configPropName : string | null;
    configPropValue : string | null;
    responseLike : string | null;
    rawTextLike : string | null;
}
