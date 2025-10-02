import { ChartDataSetItemDto } from "./chart-dataset-item-dto";

export interface ChartDataDto {
    labels : string[];
    chartDataSetItems : ChartDataSetItemDto[];
}