import { DataTableInfo } from "../../shared/models/DataTableModels/data-table-info";
import { ImportStatusDto } from "./ImportStatusDto.model";


export interface ImportStatusResponseGetDto {
    items : ImportStatusDto[];
    dataTableInfo : DataTableInfo;
}
