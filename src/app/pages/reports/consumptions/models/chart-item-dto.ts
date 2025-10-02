import { ChartDataDto } from "./chart-data-dto";

export interface ChartItemDto {
    index : number;
    title : string;
    chartData: ChartDataDto;
    lineChartType: 'line' | 'pie'
}