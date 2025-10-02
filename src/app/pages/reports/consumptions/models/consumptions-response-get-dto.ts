import { ChartItemDto } from "./chart-item-dto";
import { MetricsDetailsDto } from "./metrics-details-dto";

export interface ConsumptionsResponseGetDto {
    metricsDetails: MetricsDetailsDto<ChartItemDto>;
    //quotaDetails: QuotaDetailsDto;
}