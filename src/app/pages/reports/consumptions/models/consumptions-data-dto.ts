import { MetricsDetailsDto } from "./metrics-details-dto";
import { ChartJSItemDto } from "./chartjs-item-dto";

export interface ConsumptionsDataDto {
    metricsDetails: MetricsDetailsDto<ChartJSItemDto>;
    //quotaDetails: QuotaDetailsDto;
}