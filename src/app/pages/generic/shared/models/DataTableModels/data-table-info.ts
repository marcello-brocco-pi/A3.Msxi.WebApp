import { DataTablePageInfo } from './data-table-page-info';
import { DataTableSortInfo } from './data-table-sort-info';

export class DataTableInfo {

    //informazioni sulla pagina
    public pageInfo = new DataTablePageInfo();
    //informazioni su ordinamento
    public sortInfo = new DataTableSortInfo();
}
