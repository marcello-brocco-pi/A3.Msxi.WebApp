import { ChartConfiguration, ChartType } from "chart.js";

export interface ChartJSItemDto {
    title : string;
    chartData: ChartConfiguration['data'];
    chartOptions: ChartConfiguration['options'];
    chartPlugins : any;
    lineChartType: ChartType
}